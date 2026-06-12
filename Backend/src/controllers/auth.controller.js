import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register is usually tenant-specific in this model, or handled by a super-admin
export const register = async (req, res) => {

  const { username, password, email, role } = req.body;
  const { tenant_id } = req.tenantInfo;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await req.tenantDb.query(
      'INSERT INTO users (username, password, email, role, tenant_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [username, hashedPassword, email, role || 'user', tenant_id]
    );
    res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  const { tenant_id } = req.tenantInfo;

  try {
    // Authenticate user from the company's own database (attached to req by companyResolver)
    const result = await req.tenantDb.query(
      'SELECT id, username, email, password, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // JWT payload includes user_id, tenant_id, and role
    const token = jwt.sign(
      { 
        user_id: user.id, 
        tenant_id: tenant_id, 
        role: user.role 
      }, 
      process.env.JWT_SECRET || 'your_secret_key', 
      { expiresIn: '1d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role,
        tenant_id: tenant_id
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

