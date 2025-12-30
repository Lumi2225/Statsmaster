import axios from "axios";
import cookie from "cookie";

export default async function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.discord_token;

  if (!token) return res.status(401).json({ error: "Non connecté" });

  try {
    const user = await axios.get(
      "https://discord.com/api/users/@me",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(user.data);
  } catch {
    res.status(401).json({ error: "Token invalide" });
  }
}
