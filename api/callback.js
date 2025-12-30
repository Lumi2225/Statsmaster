import axios from "axios";
import cookie from "cookie";

export default async function handler(req, res) {
  const code = req.query.code;
  if (!code) return res.status(400).send("Code manquant");

  try {
    const token = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDIRECT_URI
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.setHeader(
      "Set-Cookie",
      cookie.serialize("discord_token", token.data.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24
      })
    );

    res.redirect("/");
  } catch (e) {
    console.error(e.response?.data);
    res.status(500).send("Erreur OAuth2");
  }
}
