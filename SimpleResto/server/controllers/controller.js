const { passwordCompare } = require("../helpers/bcrypt");
const { genNewToken } = require("../helpers/jwt");
const { User, Menu, Order, Payment, Sequelize } = require("../models")
const { Op } = Sequelize



class Controller {
    // menambahkan data baru di tabel User
    static async userRegister(req, res, next) {
        try {
            const { name, email, phone, password, role } = req.body

            const newUserData = await User.create({
                name, email, phone, password, role
            })

            res.status(201).json({
                message: `User with email ${newUserData.email} has been created`
            })
        } catch(err) {
            console.log(err);
            next(err)
        }
    }


    // fungsi untuk handle user ketika login
    static async userLogin(req, res, next) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({
                where: {
                    email: email
                }
            })
            if(!user) {
                throw { name: "AccountNotFound" }
            }

            const passwordValidation = passwordCompare(password, user.password)

            if(!passwordValidation) {
                throw { name: "InvalidPassword" }
            }

            const payload = { id: user.id }

            const access_token = genNewToken(payload)

            res.status(201).json({ access_token, id: user.id, name: user.name, email: user.email, role: user.role })
        } catch(err) {
            console.log(err);
            next(err)
        }
    }


    // menampilkan semua data user
    static async showUsers(req, res, next) {
        try {
            const users = await User.findAll({
                attributes: {
                    exclude: ["password", "createdAt", "updatedAt"]
                }
            })
            res.status(200).json(users)
        } catch(err) {
            console.log(err);
            next(err)
        }
    }

    // menampilkan semua data user
    static async showUsersById(req, res, next) {
        try {
            const users = await User.findAll({
                attributes: {
                    exclude: ["password", "createdAt", "updatedAt"]
                }
            })
            res.status(200).json(users)
        } catch(err) {
            console.log(err);
            next(err)
        }
    }


    // menampilkan semua data menu, order & payment
    static async showMenus(req, res, next) {
        try {
            const menu = await Menu.findAll({
                include: [
                    {
                        model: Order,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    },
                ],
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                order: [[
                    "id", "ASC"
                ]]
            })
            res.status(200).json(menu)
        } catch(err) {
            console.log(err);
            next(err)
        }
    }

    // menampilkan semua data menu, order & payment id terpilih
    static async showMenusById(req, res, next) {
        try {
            const { id } = req.params
            
            const menu = await Menu.findAll({
                where: {
                    id: id
                },
                include: [
                    {
                        model: Order,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    },
                ],
                attributes: {
                    exclude: ["createdAt", "updatedAt"]
                },
                order: [[
                    "id", "ASC"
                ]]
            })
            res.status(200).json(menu)
        } catch(err) {
            console.log(err);
            next(err)
        }
    }


    // menampilkan semua data order
    static async showOrders(req, res, next) {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: Menu,
                        attributes: {
                            exclude: ["createdAt", "updatedAt"]
                        }
                    }
                ],
                order: [
                    [
                        "id", "ASC"
                    ]
                ]
            })
            res.status(200).json(orders)
        } catch(err) {
            console.log(err);
            next(err)
        }
    }

    // menambahkan data baru di tabel Menu
    static async addMenu(req, res, next) {
        try {
            const { name, itemImage, description, price, category, sku, itemStock, availability } = req.body

            // const UserId = req.login.id

            const newMenuItem = await Menu.create({
                name, itemImage, description, price, category, sku, itemStock, availability
            })

            res.status(201).json(newMenuItem)
        } catch(err) {
            console.log(err);
            next(err)
        }
    }


    // menampilkan data movie yang dipilih berdasarkan id
    static async addNewOrder(req, res, next) {
        try {
            const UserId = req.login.id

            const { MenuId } = req.params

            const menuData = await Menu.findByPk(MenuId)

            if(!menuData) {
                throw { name: 'DataNotFound' }
            }

            const { quantity, totalCost } = req.body

            const newOrder = await Order.create(
                {
                    orderTime: new Date(),
                    quantity,
                    totalCost: quantity * menuData.price,
                    UserId,
                    MenuId
                }
            )
            res.status(200).json(newOrder)
        } catch(err) {
            console.log(err);
            next(err)
        }
    }

// proses pembelian dan update untuk paymentStatus, itemStock, availability
    static async orderAndPayment(req, res, next) {
        try {
            console.log('<--- Order and Payment working!')

            const { id } = req.params
            // console.log(id, "<--- id");
            const { quantity, paymentAmount } = req.body

            const userId = req.login.id

            const selectedMenu = await Menu.findByPk(id)

            if(!selectedMenu) {
                throw { name: 'MenuNotFound' }
            }

            const totalCost = selectedMenu.price * quantity
            
            console.log(totalCost, "<--- value dari totalCost");

            const order = await Order.create({
                orderTime: new Date(),
                quantity: quantity,
                totalCost: totalCost,
                UserId: userId,
                MenuId: id
            })
            console.log(order, "<-- dari order");
            console.log(order.id, "<-- dari order.id");
            const paymentChange = paymentAmount - totalCost

            console.log(paymentChange, "<--- value dari paymentChange");

            if(paymentChange < 0) {
                throw { name: 'PaymentError' }
            }

            const payment = await Order.update({
                paymentType: 'Payment Gateway',
                paymentAmount: paymentAmount,
                paymentChange: paymentChange,
                paymentStatus: 'Paid'
            }, {
                where: {
                    id: order.id
                }
            })

            const updatedMenuStock = selectedMenu.itemStock - quantity

            console.log(updatedMenuStock, "<--- value dari updatedMenuStock");

            const availability = updatedMenuStock > 0 ? 'Ready' : 'Sold Out'

            console.log(availability, "<--- value dari availability");

            await Menu.update({
                itemStock: updatedMenuStock,
                availability: availability
            }, {
                where: {
                    id: selectedMenu.id,
                    itemStock: {
                        [Op.gte]: quantity
                    }
                }
            })

            res.status(201).json({
                message: "Order and payment success!",
                data: {
                    orderId: order.id,
                    paymentId: payment.id,
                    paymentChange: paymentChange
                }
            })

        } catch(err) {
            console.log(err);
            next(err)
        }
    }

}

module.exports = Controller