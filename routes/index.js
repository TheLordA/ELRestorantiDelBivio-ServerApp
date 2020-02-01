const API_KEY = 1234;
const SECRET_KEY = "My_Restaurant_dfegryfhgtrlokdgfr";
const express = require("express");
const router = express.Router();
const moment = require("moment");

//Add JSON WEB Token to secure the API
const exjwt = require('express-jwt');

const jwtMW = exjwt({
    secret: SECRET_KEY
});

//JWT Test
router.get('/testjwt', jwtMW, function (req, res) {
    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;
    res.send(JSON.stringify({success: true, message: fbid}));
});

//========= JWT ==========
router.get('/getkey', function (req, res, next) {
    let fbid = req.query.fbid;
    if (fbid != null) {
        let token = jwt.sign({fbid: fbid}, SECRET_KEY, {}); //Sign Token
        res.send(JSON.stringify({success: true, token: token}));

    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in query "}))
    }

});


//GET
router.get("/", function (req, res, next) {
    res.send("Welcome To The ELRestorantDelBivio API")
});

//========= User Table GET/POST ==========
router.get("/user", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;
    if (fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("SELECT UserPhone,Name,Address,FBID FROM user where FBID=?", [fbid], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in JWT "}))
    }
});
router.post("/user", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;
    const user_phone = req.body.userPhone
    const user_name = req.body.username
    const user_address = req.body.userAddress

    if (fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("INSERT INTO user(FBID,UserPhone,Name,Address) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE Name=?,Address=?", [fbid, user_phone, user_name, user_address, user_name, user_address], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.affectedRows > 0) {
                        res.send(JSON.stringify({success: true, message: "Success"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in JWT "}))
    }
});

//========= Token Table GET/POST ==========
router.get("/token", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;
    if (fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("SELECT fbid,token FROM token where fbid=?", [fbid], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in JWT "}))
    }
});
router.post("/token", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;
    let token = req.body.token

    if (fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("INSERT INTO token(FBID,Token) VALUES(?,?) ON DUPLICATE KEY UPDATE Token=?", [fbid, token, token], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.affectedRows > 0) {
                        res.send(JSON.stringify({success: true, message: "Success"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in JWT "}))
    }
});

//========= ShippingOrder Table GET/POST ==========
router.get("/shippingorder", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let restaurantId = req.query.restaurantId;
    if (restaurantId != null) {
        req.getConnection(function (error, conn) {
            conn.query("SELECT OrderId,ShippinStatus,ShipperId FROM shippingorder where RestaurantId=?", [restaurantId], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing RestaurantId in Query "}))
    }
});
router.post("/shippingorder", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let orderId = req.body.orderId;
    let restaurantId = req.body.restaurantId;

    if (orderId != null && restaurantId != null) {
        req.getConnection(function (error, conn) {
            conn.query("INSERT INTO shippingorder(OrderId,ShippingStatus,ShipperId,RestaurantId) VALUES(?,?,?,?) ", [orderId,1,0,restaurantId], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.affectedRows > 0) {
                        res.send(JSON.stringify({success: true, message: "Success"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing OrderId , RestaurantId in Body "}))
    }
});

//========= RestaurantOwner Table GET/POST ==========
router.get("/restaurantowner", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;

    if (fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("SELECT userPhone,name,CASE WHEN status=0 THEN \'FALSE\' ELSE \'TRUE\' END as status,restaurantId,fbid FROM restaurantOwner where fbid=?", [fbid], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in JWT "}))
    }
});
router.post("/restaurantowner", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;
    let user_phone = req.body.userPhone;
    let user_name = req.body.userName;

    if (fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("INSERT INTO restaurantOwner(FBID,UserPhone,Name,Status) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE Name=?", [fbid, user_phone, user_name, 0, user_name], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.affectedRows > 0) {
                        res.send(JSON.stringify({success: true, message: "Success"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in JWT "}))
    }
});

//========= Favorite Table GET/POST/DELETE =========
router.get("/favorite", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;
    if (fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("SELECT fbid,foodId,restaurantID,restaurantName,foodName,price FROM favorite WHERE fbid=?", [fbid], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in JWT "}))
    }
});
router.get("/favoriteByRestaurant", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;
    const restaurant_id = req.query.restaurantId

    if (fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("SELECT fbid,foodId,restaurantID,restaurantName,foodName,price FROM favorite WHERE fbid=? AND restaurantID=?", [fbid, restaurant_id], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in JWT "}))
    }
});
router.post("/favorite", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;
    const food_id = req.body.foodId
    const restaurant_id = req.body.restaurantId
    const restaurant_name = req.body.restaurantName
    const food_name = req.body.foodName
    const food_image = req.body.foodImage
    const food_price = req.body.price

    if (fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("INSERT INTO favorite(FBID,FoodId,RestaurantId,RestaurantName,FoodName,FoodImage,Price) VALUES(?,?,?,?,?,?,?)", [fbid, food_id, restaurant_id, restaurant_name, food_name, food_image, food_price], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.affectedRows > 0) {
                        res.send(JSON.stringify({success: true, message: "Success"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in JWT "}))
    }
});
router.delete("/favorite", jwtMW, function (req, res, next) {

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let fbid = decoded.fbid;
    const food_id = req.query.foodId
    const restaurant_id = req.query.restaurantId

    if (fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("DELETE FROM favorite WHERE FBID=? AND FoodID=? AND RestaurantId=?", [fbid, food_id, restaurant_id], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.affectedRows > 0) {
                        res.send(JSON.stringify({success: true, message: "Success"}))
                    }
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing fbid in JWT "}))
    }
});

//========= Restaurant Table GET =========
router.get("/restaurant", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        conn.query("SELECT id,name,address,phone,lat,lng,userOwner,image,paymentUrl FROM restaurant", function (err, rows, fields) {
            if (err) {
                res.status(500)
                res.send(JSON.stringify({success: false, message: err.message}))
            } else {
                if (rows.length > 0) {
                    res.send(JSON.stringify({success: true, result: rows}))
                } else {
                    res.send(JSON.stringify({success: false, message: "Empty"}))
                }
            }
        })
    })
}); //err to check
router.get("/restaurantById", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const restaurant_id = req.query.restaurantId
        if (restaurant_id != null) {
            conn.query("SELECT id,name,address,phone,lat,lng,userOwner,image,paymentUrl FROM restaurant WHERE id=?", [restaurant_id], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing restaurant ID in query"}))
        }
    })
});
router.get("/nearbyrestaurant", function (req, res, next) {
    req.getConnection(function (error, conn) {
        const user_lat = parseFloat(req.query.lat)
        const user_lng = parseFloat(req.query.lng)
        const distance = parseFloat(req.query.distance)

        if (user_lat != Number.NaN && user_lng != Number.NaN) {
            conn.query("SELECT * FROM (SELECT id,name,address,phone,lat,lng,userOwner,image,paymentUrl,"
                + "ROUND(111.045 * DEGREES(ACOS(COS(RADIANS(?))*COS(RADIANS(lat))"
                + "* COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?))"
                + "* SIN(RADIANS(lat)))),2) AS distance_in_km FROM restaurant)tempTable WHERE distance_in_km < ?", [user_lat, user_lng, user_lat, distance], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        }
    })
});

//========= MENU Table GET =========
router.get("/menu", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const restaurant_id = req.query.restaurantId
        if (restaurant_id != null) {
            conn.query("SELECT id,name,description,image FROM menu WHERE id in (SELECT menuId FROM restaurant_menu WHERE restaurantId=?)", [restaurant_id], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing restaurant ID in query"}))
        }
    })
});

//========= FOOD Table GET =========
router.get("/food", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const menu_id = req.query.menuId
        if (menu_id != null) {
            conn.query("SELECT id,name,description,image,price,CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'FALSE\' END as isSize,"
                + "CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'FALSE\' END as isAddon,"
                + " discount FROM food WHERE id in (SELECT FoodId FROM menu_food WHERE MenuId=?)", [menu_id], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing menu ID in query"}))
        }
    })
});
router.get("/foodById", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const food_id = req.query.foodId
        if (food_id != null) {
            conn.query("SELECT id,name,description,image,price,CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'FALSE\' END as isSize,"
                + "CASE WHEN isAddon=1 THEN \'TRUE\ ELSE \'FALSE\' END as isAddon,"
                + " discount FROM food WHERE id=?", [food_id], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing food ID in query"}))
        }
    })
});
router.get("/searchfood", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const search_query = "%" + req.query.foodName + "%"
        if (search_query != null) {
            conn.query("SELECT id,name,description,image,price,CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'FALSE\ END as isSize,"
                + "CASE WHEN isAddon=1 THEN \'TRUE\ ELSE \'FALSE\' END as isAddon,"
                + " discount FROM food WHERE name LIKE ?", [search_query], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing food name in query"}))
        }
    })
});

//========= SIZE Table GET =========
router.get("/size", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const food_id = req.query.foodId
        if (food_id != null) {
            //SELECT id,name,description,extraPrice FROM size WHERE id in (SELECT sizeId FROM food_size WHERE foodId=?)
            conn.query("SELECT s.ID ,name,s.Description,s.extraPrice FROM size s ,food WHERE s.ID in (SELECT sizeId FROM food_size WHERE foodId=?)", [food_id], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing food ID in query"}))
        }
    })
}); //err to check -1

//========= ADDON Table GET =========
router.get("/addon", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const food_id = req.query.foodId
        if (food_id != null) {
            conn.query("SELECT id,name,description,extraPrice FROM addon WHERE id in (SELECT addonId FROM food_addon WHERE foodId=?)", [food_id], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing food ID in query"}))
        }
    })
});

//========= ORDER Table GET/POST =========
router.get("/orderbyrestaurant", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        let restaurantId = req.query.restaurantId;
        let startIndex = parseInt(req.query.from);
        let endIndex = parseInt(req.query.to);

        //set default if user not pass params
        if (isNaN(startIndex))
            startIndex = 0;
        if (isNaN(endIndex))
            endIndex = 0;

        if (restaurantId != null) {
            conn.query("SELECT orderId,orderFBID,orderPhone,orderName,orderAddress,orderStatus,orderDate"
                + "restaurantId,transactionId,"
                + "CASE WHEN COD=1 THEN \'TRUE\' ELSE \'FALSE\' END as cod,"
                + "totalPrice,numOfItem FROM order WHERE RestaurantId=? AND NumOfItem > 0" // if an error check this line , exactly the totalPrice
                + "ORDER BY orderId DESC LIMIT ?,? ", [restaurantId, startIndex, endIndex], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing RestaurantId in query"}))
        }
    })
});
router.get("/maxorderbyrestaurant", jwtMW, function (req, res, next) {

    req.getConnection(function (error, conn) {
        let authorization = req.headers.authorization, decoded;
        try {
            decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        let restaurantId = decoded.restaurantId;
        if (restaurantId != null) {
            conn.query("SELECT COUNT(OrderId) as maxRowNum FROM `order` WHERE restaurantId=? AND numOfItem > 0" // if an error check this line , exactly the totalPrice
                + "ORDER BY orderId DESC ", [restaurantId], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing RestaurantId in query"}))
        }
    })
});
router.get("/order", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const order_fbid = req.query.orderFBID
        const startIndex = parseInt(req.query.from)
        const endIndex = parseInt(req.query.to)
        if (order_fbid != null) {
            conn.query("SELECT orderId,orderFBID,orderPhone,orderName,orderAddress,orderStatus,orderDate"
                + "restaurantId,transactionId,"
                + "CASE WHEN COD=1 THEN \'TRUE\' ELSE \'FALSE\' END as cod,"
                + "totalPrice,numOfItem FROM order WHERE OrderFBID=? AND NumOfItem > 0" // if an error check this line , exactly the totalPrice
                + "ORDER BY orderId DESC LIMIT ?,? ", [order_fbid, startIndex, endIndex], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing food ID in query"}))
        }
    })
});
router.get("/maxorder", jwtMW, function (req, res, next) {

    req.getConnection(function (error, conn) {
        let authorization = req.headers.authorization, decoded;
        try {
            decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        let order_fbid = decoded.fbid;
        if (order_fbid != null) {
            conn.query("SELECT COUNT(OrderId) as maxRowNum FROM `order` WHERE orderFBID=? AND numOfItem > 0" // if an error check this line , exactly the totalPrice
                + "ORDER BY orderId DESC ", [order_fbid], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing food ID in query"}))
        }
    })
});
router.post("/createOrder", jwtMW, function (req, res, next) {

    const order_phone = req.body.orderPhone
    const order_name = req.body.orderName
    const order_address = req.body.orderAddress
    const order_date = moment(req.body.restaurantName, "MM/DD/YYYY").format("YYYY-MM-DD")
    const restaurant_id = req.body.restaurantId
    const transaction_id = req.body.transactionId
    const cod = (req.body.cod == "true")
    const total_price = req.body.totalPrice
    const num_of_item = req.body.numOfItem

    let authorization = req.headers.authorization, decoded;
    try {
        decoded = jwt.verify(authorization.split(' ')[1], SECRET_KEY);
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    let order_fbid = decoded.fbid;

    if (order_fbid != null) {
        req.getConnection(function (error, conn) {
            conn.query("INSERT INTO order(OrderFBID,OrderPhone,OrderName,OrderAddress,OrderStatus,OrderDate,RestaurantId,TransactionId,COD,TotalPrice,NumOfItem)" +
                "VALUES(?,?,?,?,?,?,?,?,?,?,?)", [order_fbid, order_phone, order_name, order_address, 0, order_date, restaurant_id, transaction_id, cod, total_price, num_of_item], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    conn.query("SELECT OrderId as orderNumber FROM `order` WHERE OrderFBID =? AND NumOfItem >0 ORDER BY ordernumber DESC LIMIT 1", [order_fbid], function (err, rows, fields) {
                        if (err) {
                            res.status(500)
                            res.send(JSON.stringify({success: false, message: err.message}))
                        } else {
                            res.send(JSON.stringify({success: false, result: rows}))
                        }
                    })
                }
            })
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing order FBID in body "}))
    }
});
router.put("/updateOrder", jwtMW, function (req, res, next) {
    const order_id = parseInt(req.body.orderID);
    const order_status = parseInt(req.body.orderStatus);

    if (order_id != null && order_status != null) {

        req.getConnection(function (error, conn) {
            if (Number.isInteger(order_id) && Number.isInteger(order_status)){
                conn.query("UPDATE order SET OrderStatus = ? WHERE OrderId = ?",[order_status,order_id], function (err, rows, fields) {
                    if (err) {
                        res.status(500);
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        res.send(JSON.stringify({success: true, message: "update success"}))
                    }
                })
            }else{
                res.send(JSON.stringify({success: false, message: "order_ID and order_Status must be Integers "}))
            }
        })
    } else {
        res.send(JSON.stringify({success: false, message: "Missing order_ID and order_Status in body "}))
    }
});

//========= ORDERDetail Table GET/POST =========
router.get("/hotfood", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const order_id = req.query.orderID
            const query = "SELECT tempTable.ItemId,tempTable.name,ROUND((COUNT(tempTAble.ItemId)*100 / ( SELECT COUNT(*) FROM orderdetail)),2) as percent"
                +"FROM (SELECT ItemId,name FROM food INNER JOIN orderdetail ON food.Id = orderdetail.ItemId) tempTable"
                +"GROUP BY tempTable.itemId,tempTable.name"
                +"LIMIT 10"
            conn.query(query, function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
    })
});
router.get("/orderDetailbyrestaurant", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const order_id = req.query.orderID
        if (order_id != null) {
            conn.query("SELECT OrderDetail.OrderId,ItemId,Quantity,Size,AddOn,OrderFBID,Name,Description,Image FROM orderdetail "
                +"INNER JOIN order ON OrderDetail.OrderId='Order'.orderId"
                +"INNER JOIN food ON OrderDetail.ItemId=food.ID"
                +"WHERE OrderDetail.OrderId=?", [order_id], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing Order ID in query"}))
        }
    })
});
router.get("/orderDetail", jwtMW, function (req, res, next) {
    req.getConnection(function (error, conn) {
        const order_id = req.query.orderID
        if (order_id != null) {
            conn.query("SELECT orderId,itemId,quantity,discount,extraPrice,size,addOn FROM orderdetail WHERE orderId=?", [order_id], function (err, rows, fields) {
                if (err) {
                    res.status(500)
                    res.send(JSON.stringify({success: false, message: err.message}))
                } else {
                    if (rows.length > 0) {
                        res.send(JSON.stringify({success: true, result: rows}))
                    } else {
                        res.send(JSON.stringify({success: false, message: "Empty"}))
                    }
                }
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing Order ID in query"}))
        }
    })
});
router.post("/updateOrder", jwtMW, function (req, res, next) {
        const order_id = req.body.orderID
        let order_detail

        try {
            order_detail = JSON.parse(req.body.orderDetail)
        } catch (err) {
            res.status(500)
            res.send(JSON.stringify({success: false, message: err.message}))
        }

        if (order_detail != null && order_id != null) {

            let data_insert = []
            for (i = 0; i < order_detail.length; i++) {
                data_insert[i] = [
                    parseInt(order_id),
                    order_detail[i]["foodId"],
                    order_detail[i]["foodQuantity"],
                    order_detail[i]["foodPrice"],
                    0, // discount
                    order_detail[i]["foodSize"],
                    order_detail[i]["foodAddon"],
                    parseFloat(order_detail[i]["foodExtraPrice"])
                ]
            }

            req.getConnection(function (error, conn) {
                conn.query("INSERT INTO orderdetail (OrderId,ItemId,Quantity,Price,Discount,Size,Addon,ExtraPrice) VALUES(?)", data_insert, function (err, rows, fields) {
                    if (err) {
                        res.status(500)
                        res.send(JSON.stringify({success: false, message: err.message}))
                    } else {
                        res.send(JSON.stringify({success: true, message: "update success"}))
                    }
                })
            })
        } else {
            res.send(JSON.stringify({success: false, message: "Missing order_ID and order_detail in body "}))
        }
});


module.exports = router;