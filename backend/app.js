const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRouter = require("./routers/places-routes");
const usersRouter = require("./routers/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); // sử dụng dữ liệu dưới dạng json

app.use("/uploads/images", express.static(path.join("uploads", "images"))); // thêm route sử dụng cho truy cập hình ảnh

// cấu hình lại cho header của app
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    next();
});
// các đường dẫn nên / bắt đầu là api để dễ dàng setup cho bên frontend và biết rằng đường dẫn đó là một api
app.use("/api/places", placesRouter); // route sử dụng cho place
app.use("/api/users", usersRouter); // route sử dụng cho user

app.use((req, res, next) => {
    const error = new HttpError("Cound not find this route.", 404); // chăn người dùng truy cập vào các tuyến đường chưa được đăng ký
    throw error;
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        }); //xóa file nhận được nếu bị lỗi
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred!" });
});

// kết nối với mongoodb nó sẽ trả về một promises sau khi kết nối thành công sẽ chạy server bằng app.listen
mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@mern-stack.qaiddcb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log("listening on 5000");
        });
    })
    .catch((err) => console.log(err));
