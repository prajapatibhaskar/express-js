import { Router } from "express";

const router = Router();
router.get("/api/products", (req, res) => {

  if (req.signedCookies.Hello && req.signedCookies.Hello === "World") {
    return res.send({
      id: 123,
      name: "Chicken",
      price: 12.99,
    });
  }

  return res.status(401).send({
    msg: 'Sorry, it seems the cookie has expired or you need the correct cookie'
  })
});

export default router;
