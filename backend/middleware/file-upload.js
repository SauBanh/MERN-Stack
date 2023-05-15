const multer = require("multer");
const {
    ref,
    uploadBytesResumable,
    getDownloadURL,
} = require("firebase/storage");

const configFirebase = require("../config/config-firebase");

/*
trong hàm multer tham số đầu tiên là một object
trong object các khóa như:
+ limits dùng để giới hạn dữ liệu gửi lên server
+ storage sẽ dùng để kiểm soát dữ liệu được lưu trữ và có thể gọi được nhiều ổ lưu trữ bằng diskStorage trong đó filename dùng để
mở rộng một số tệp nhất định được giới hạn trong MINE_TYPE_MAP. Callback có tham số đầu tiên là một lỗi gọi lại, 
tham số thứ 2 là tên file với đuôi file đúng định dạng và tên file là duy nhất. Trong destination có một callback
tham số đầu sẽ là lỗi nếu có và tham số 2 là một đường dẫn vị trí truyền tệp vào
+ fileFilter dùng để kiểm tra giá trị hợp lệ trong của tệp truyền lên trong MINE_TYPE_MAP và có một callback với tham số đầu là một
lỗi tham số 2 trả về true false với giá trị truyền vào
*/

const fileUpload = multer({
    // limits: 500000,
    // storage: multer.diskStorage({
    //     destination: (req, file, cb) => {
    //         cb(null, "uploads/images");
    //     },
    //     filename: (req, file, cb) => {
    //         const ext = MIME_TYPE_MAP[file.mimetype];
    //         cb(null, uuid.v1() + "." + ext);
    //     },
    // }),
    // fileFilter: (req, file, cb) => {
    //     const isValid = !!MIME_TYPE_MAP[file.mimetype];
    //     let error = isValid ? null : new Error("Invalid file type!");
    //     cb(error, isValid);
    // },
    storage: multer.memoryStorage(),
});

const upload = multer({ fileUpload });

async function uploadFirebase(file) {
    const metadata = {
        contentType: file.mimetype,
    };
    const storageRef = ref(
        configFirebase.storage,
        `/file/${file.originalname}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file.buffer, metadata);
    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Cập nhật tiến trình tải lên nếu cần
            },
            (error) => {
                // Xử lý lỗi tải lên
                console.error(error);
                reject(error);
            },
            async () => {
                // Tải lên thành công, lấy download URL
                try {
                    const downloadURL = await getDownloadURL(
                        uploadTask.snapshot.ref
                    );
                    resolve(downloadURL);
                } catch (error) {
                    console.error("Error getting download URL:", error);
                    reject(error);
                }
            }
        );
    });
}

exports.fileUpload = upload;
exports.uploadFirebase = uploadFirebase;
