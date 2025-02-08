var express = require('express');
var router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const { stringify } = require('jade/lib/utils');

// Get All Users
router.get('/get-all', async function (req, res) {
  const users = await prisma.user.findMany();
  if (users.length === 0 || users === null || users === undefined) {
    {
      res.status(404).json({ message: 'User Kosong' });
    }
    res.json(users);
  }
});

// Create User
router.post('/create', async function (req, res) {
  const { name, email, password } = req.body;
  name === ''
    ? res.status(404).json('Isi Namanya')
    : email === ''
      ? res.status(404).json('Isi Emailnya')
      : password === ''
        ? res.status(404).json('Isi Passwordnya')
        : async () => {
            const hashPassword = await bcrypt.hash(password, 10);
            const stringPassword = stringify(hashPassword);
            const users = await prisma.user.create({
              data: {
                username: name,
                email,
                password: stringPassword,
              },
            });
            res.send(users);
          };
});

// Update User
router.put('/update/:id', async function (req, res) {
  const { id } = req.params;
  const { name, email, password } = req.body;
  name === ''
    ? res.status(404).json('Isi Namanya')
    : email === ''
      ? res.status(404).json('Isi Emailnya')
      : password === ''
        ? res.status(404).json('Isi Passwordnya')
        : async () => {
            const hashPassword = await bcrypt.hash(password, 10);
            const stringPassword = stringify(hashPassword);
            const users = await prisma.user.update({
              where: {
                id: parseInt(id),
              },
              data: {
                username: name,
                email,
                password: stringPassword,
              },
            });
            res.send(users);
          };
});

// Delete User
router.delete('/delete/:id', async function (req, res) {
  const { id } = req.params;
  const userExist = await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  userExist === null
    ? res.json('User ID Not Found')
    : async () => {
        const users = await prisma.user.delete({
          where: {
            id: parseInt(id),
          },
        });
        res.send(users);
      };
});

module.exports = router;
