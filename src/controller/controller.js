const { comparePassword, hashedPassword } = require("../helpers/bcrypt");
const { generateToken, setTokenCookie } = require("../helpers/jwt");
const wrap = require("../helpers/wrapper");
const {
  createUser,
  findUserById,
  findByEmail,
} = require("../service/user.service");
const {
  createWallet,
  depositIntoWallet,
  checkIfWalletBelongsToUser,
  updateWalletBalance,
  withdrawFromWallet,
} = require("../../src/service/wallet.service");
const { createTransaction } = require("../service/transaction.service");

exports.createANewUser = wrap(async (req, res) => {
  let { email, password } = req.body;
  const foundUser = await findByEmail(email);
  if (foundUser) {
    return res.status(409).json({ message: "User already exists" });
  }
  password = await hashedPassword(password);
  const newUser = await createUser(email, password); // 1
  const createdUser = await findUserById(newUser.insertId);
  await createWallet(createdUser[0].id, createdUser[0].email);
  return res.status(201).json({ message: "User created successfully" });
});

exports.userLogin = wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  const token = await generateToken({
    id: user.id,
    email: user.email,
    roles: user.roles,
  });
  setTokenCookie(res, token);
  return res.status(200).json({ id: user.id, user: user.email, token: token });
});

exports.userLogin = wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await findByEmail(email);
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
  const token = await generateToken({
    id: user.id,
    email: user.email,
    is_premium: user.is_premium,
    is_active: user.is_active,
    roles: user.roles,
  });
  setTokenCookie(res, token);
  return res.status(200).json({ id: user.id, user: user.email, token: token });
});

exports.depositIntoWallet = wrap(async (req, res) => {
  const { id } = req.user;
  const { amount } = req.body;
  let user = await findUserById(id);
  const wallet = await checkIfWalletBelongsToUser(id, user[0].email);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });
  const amountToNumber = +amount;
  const deposit = await depositIntoWallet(id, amountToNumber);
  let newBalance = +wallet[0].balance + amountToNumber;
  await createTransaction(
    id,
    wallet[0].id,
    amountToNumber,
    newBalance,
    "deposit",
    0
  );

  return res.status(200).json({
    message: `Deposit successful of NGN${amount}`,
    deposit: deposit[0],
  });
});

exports.withdrawFromWallet = wrap(async (req, res) => {
  const { id } = req.user;
  const { amount } = req.body;
  let user = await findUserById(id);
  const wallet = await checkIfWalletBelongsToUser(id, user[0].email);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  const amountToNumber = +amount;
  if (amountToNumber > wallet[0].balance)
    return res.status(400).json({ message: "Insufficient funds" });
  const newBalance = wallet[0].balance - amountToNumber;

  await withdrawFromWallet(id, amountToNumber);
  await createTransaction(
    id,
    wallet[0].id,
    amountToNumber,
    newBalance,
    "withdrawal"
  );
  await updateWalletBalance(newBalance, id, wallet[0].id);
  
  return res.status(200).json({
    message: `Withdrawal successful of NGN${amount}`,
    newBalance:`NGN${newBalance}`,
  });
});

exports.transferMoney = wrap(async (req, res) => {
  const { id } = req.user;
  const { email, amount } = req.body;

  if (email === req.user.email)
    return res.status(400).json({ message: "You cannot transfer to yourself" });

  if (amount < 0)
    return res.status(400).json({ message: "You cannot transfer -ve amount" });

  let user = await findUserById(id);
  const wallet = await checkIfWalletBelongsToUser(id, user[0].email);
  if (!wallet) return res.status(404).json({ message: "Wallet not found" });

  const amountToNumber = +amount;
  if (amountToNumber > wallet[0].balance)
    return res.status(400).json({ message: "Insufficient funds" });
  const receiver = await findByEmail(email);
  if (!receiver) return res.status(404).json({ message: "Receiver not found" });
  const receiverWallet = await checkIfWalletBelongsToUser(
    receiver.id,
    receiver.email
  );
  if (!receiverWallet)
    return res.status(404).json({ message: "Receiver wallet not found" });
  let senderNewBalance = wallet[0].balance - amountToNumber;
  await withdrawFromWallet(id, amountToNumber);
  let receiverNewBalance = +receiverWallet[0].balance + amountToNumber;
  await depositIntoWallet(receiver.id, amountToNumber);
  await createTransaction(
    id,
    wallet[0].id,
    amountToNumber,
    senderNewBalance,
    "transfer",
    0
  );
  await createTransaction(
    receiver.id,
    receiverWallet[0].id,
    amountToNumber,
    receiverNewBalance,
    "deposit",
    0
  );
  await updateWalletBalance(senderNewBalance, id, wallet[0].id);
  await updateWalletBalance(
    receiverNewBalance,
    receiver.id,
    receiverWallet[0].id
  );

  return res.status(200).json({
    message: `Transfer successful of NGN${amount} to ${receiver.email}`,
    walletOwner: user[0].email,
  });
});
