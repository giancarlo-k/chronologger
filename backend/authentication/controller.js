import { User } from "./model.js";
import { hash, compare } from "./crypt.js";

export const addUser = async (req, res) => {
  try {
    const { username: plainUsername, password: plainPassword } = req.body;
    const username = plainUsername.toLowerCase();

    const isDuplicate = await User.findOne({ username });

    if (isDuplicate) {
      return res.status(409).json({ message: 'Username taken' });
    }
  
    const newUser = await User.create({ username, password: await hash(plainPassword) });
  
    return res.status(200).json(newUser);

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
}

export const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany({});

    return res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
}

// login
export const authenticateUser = async (req, res) => {
  const { username, password: plainPassword } = req.body;

  const user = await User.findOne({
    username: username.toLowerCase()
  })

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  const isMatched = await compare(plainPassword, user.password)

  if (!isMatched) {
    return res.status(401).json({ error: 'Incorrect password' });
  }

  req.session.user = { username };
  return res.status(200).json({ message: 'Logged in successfully!' });
}

export const isAuthenticated = async (req, res) => {  
  console.log(req.session.user)
  if (req.session.user) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
}

export const logout = (req, res) => {
  req.session.destroy(error => {
    if (error) {
      return res.status(500).json({ message: 'Logout failed' })
    }
  });
  res.clearCookie("connect.sid", { path: "/" });
  return res.status(200).json({ message: 'Logged out successfully!'})
}
