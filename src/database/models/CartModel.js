const { CartSchema } = require('../schema');

const createCart = async (insertData) => {

    const cart = new CartSchema(insertData)

    const cartResult = await cart.save().then((data) => {
        return data
    }).catch((err) => {
        return false
    });

    return cartResult;
}

const fatchCartList = async (user_id) => {

    const cartData = await CartSchema.find({ 
        $and: [
            {
                user_id: user_id
            }
        ]
    }).sort({ createdAt: -1 }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return cartData;
}

const filterCartData = async (user_id, course_id) => {

    const cartData = await CartSchema.findOne({ 
        $and: [
            {
                user_id: user_id
            },
            {
                course_id: course_id
            }
        ]
    }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return cartData;
}

const removeCartData = async (id) => {

    const cartData = await CartSchema.deleteOne({_id: id }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return cartData;
}

const removeAllCartData = async (id) => {

    const cartData = await CartSchema.deleteMany({user_id: id }).then((data) => {
        return data
    }).catch((err) => {
        return null
    });
    return cartData;
}

module.exports = {
    createCart,
    removeCartData,
    fatchCartList,
    filterCartData,
    removeAllCartData
}