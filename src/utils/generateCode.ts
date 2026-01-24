export default function generateCode(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 5 }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
}
