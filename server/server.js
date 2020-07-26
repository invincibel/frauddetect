//import Webcam from 'webcam-easy';

const express = require("express");
const path = require("path");
const { get } = require("request");

const app = express();
var cors = require("cors");

app.use(cors());
//const Buffer = require('buffer')

//const express = require('express');
//const app = express();

const bodyParser = require("body-parser");
const fs = require("fs");
const mime = require("mime");
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
const viewsDir = path.join(__dirname, "views");
app.use(express.static(viewsDir));

app.use(express.static(path.join(__dirname, "/build")));

app.use(express.static(path.join(__dirname, "./public")));
app.use(express.static(path.join(__dirname, "../images")));
app.use(express.static(path.join(__dirname, "../media")));
app.use(express.static(path.join(__dirname, "../../weights")));
app.use(express.static(path.join(__dirname, "../../dist")));
app.use("/cam", express.static(__dirname + "/cam"));

app.get("/", (req, res) => {
  res.sendFile("./build/index.html");
});
app.get("/face_detection", (req, res) =>
  res.sendFile(path.join(viewsDir, "bbtFaceRecognition.html"))
);
app.get("/get_snap", (req, res) =>
  res.sendFile(path.join(viewsDir, "getsnap.html"))
);
app.get("/bbt_face_recognition", (req, res) =>
  res.sendFile(path.join(viewsDir, "bbtFaceRecognition.html"))
);
app.get("/name", callName);
app.get("/analytic/user", analytic);
app.get("/analytic/all", analyticall);
app.get("/getFraud", getFraud);
app.get("/writedata", writecsv);
app.get("/getemail", getemail);
app.get("/isexists", isexists);
app.post("/send", mailPls);
app.post("/deleteImages", deleteIm);
const uploadImage = async (req, res, next) => {
  // to declare some path to store your converted image

  if (req.body.base64image) {
    var matches = req.body.base64image.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      ),
      response = {};

    if (matches.length !== 3) {
      return new Error("Invalid input string");
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], "base64");
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.extension(type);
    console.log(extension);
    //console.log(req.body);
    let fileName = req.body.name + "." + extension;
    try {
      fs.writeFileSync("cam/" + fileName, imageBuffer, "utf8");
      return res.send({ status: "success" });
    } catch (e) {
      next(e);
    }
    // res.send("Done");
  } else {
    res.send({ status: "failed" });
  }
  //console.log(req.body.base64image);
};

const setup = async (req, res, next) => {
  // to declare some path to store your converted image

  if (req.body.base64image) {
    var matches = req.body.base64image.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      ),
      response = {};
    var matches1 = req.body.base64image1.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      ),
      response1 = {};
    var matches2 = req.body.base64image2.match(
        /^data:([A-Za-z-+\/]+);base64,(.+)$/
      ),
      response2 = {};

    response.type = matches[1];
    response1.type = matches1[1];
    response2.type = matches2[1];
    response.data = new Buffer(matches[2], "base64");
    response1.data = new Buffer(matches1[2], "base64");
    response2.data = new Buffer(matches2[2], "base64");
    let decodedImg = response;
    let decodedImg1 = response1;
    let decodedImg2 = response2;
    let imageBuffer = decodedImg.data;
    let imageBuffer1 = decodedImg1.data;
    let imageBuffer2 = decodedImg2.data;
    let type = decodedImg.type;
    let type1 = decodedImg1.type;
    let type2 = decodedImg2.type;
    let extension = mime.extension(type);
    let extension1 = mime.extension(type1);
    let extension2 = mime.extension(type2);
    console.log(extension);
    //console.log(req.body);
    let fileName = req.body.card + "_11." + extension;
    let fileName1 = req.body.card + "_12." + extension1;
    let fileName2 = req.body.card + "_13." + extension2;
    try {
      var spawn = require("child_process").spawn;
      var process = spawn("python3", [
        "./setup.py",
        req.body.card,
        req.body.email,
      ]);

      process.stdout.on("data", function (data) {
        // console.log("Result is", data.toString());
        // res.send({ status: "failed" });
        //console.log(data.toString());
        result = data.toString();
        result = result.split("'").join('"');
        var result = JSON.parse(result);
        if (result.status == "success") {
          fs.writeFileSync("assets/img/users/" + fileName, imageBuffer, "utf8");
          fs.writeFileSync(
            "assets/img/users/" + fileName1,
            imageBuffer,
            "utf8"
          );
          fs.writeFileSync(
            "assets/img/users/" + fileName2,
            imageBuffer,
            "utf8"
          );
        }
        res.send(data.toString());
      });
    } catch (e) {
      next(e);
    }
  } else {
    res.send({ status: "failed" });
  }
  //console.log(req.body.base64image);
};
function deleteIm(req, res) {
  var img = req.body.img1;
  var img1 = req.body.img2;
  var img2 = req.body.img3;
  var img3 = req.body.img4;
  try {
    fs.unlinkSync("cam/" + img);
    fs.unlinkSync("cam/" + img1);
    fs.unlinkSync("cam/" + img2);
    fs.unlinkSync("cam/" + img3);
    res.send({ status: "success" });
  } catch {
    //console.log(req.query);
    res.send({ status: "failed" });
  }
}
function mailPls(req, res) {
  //  console.log("Inside mail pls", req);
  var nodemailer = require("nodemailer");
  var email = req.body.email;

  var img = req.body.img1;
  var img1 = req.body.img2;
  var img2 = req.body.img3;
  var img3 = req.body.img4;
  console.log("Email recv is ", email);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "optimumdelloite@gmail.com",
      pass: "Optimum@31",
    },
  });

  var mailOptions = {
    from: "Fraud Detection",
    to: email,
    subject: "Fraud Detection Prototype",
    text: "This person was trying to use your card !!",
    attachments: [
      {
        // stream as an attachment
        filename: img,
        content: fs.createReadStream("cam/" + img),
      },
      {
        // stream as an attachment
        filename: img1,
        content: fs.createReadStream("cam/" + img1),
      },
      {
        // stream as an attachment
        filename: img2,
        content: fs.createReadStream("cam/" + img2),
      },
      {
        // stream as an attachment
        filename: img3,
        content: fs.createReadStream("cam/" + img3),
      },
    ],
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        fs.unlinkSync("cam/" + img);
        fs.unlinkSync("cam/" + img1);
        fs.unlinkSync("cam/" + img2);
        fs.unlinkSync("cam/" + img3);
      }
    });
    return res.send({ status: "success" });
  } catch (e) {
    return res.send({ status: "failed" });
  }
}

function getemail(req, res) {
  try {
    var spawn = require("child_process").spawn;

    var process = spawn("python3", ["./getemail.py", req.query.name]);

    process.stdout.on("data", function (data) {
      data = data.toString().trim();
      console.log(data);
      if (data.length) {
        res.send(data.toString());
      } else {
        res.send({ status: "failed" });
      }
    });
  } catch (e) {
    res.send({ status: "failed" });
  }
}

function isexists(req, res) {
  try {
    console.log("exsist ", req.query.name);
    var spawn = require("child_process").spawn;

    var process = spawn("python3", ["./exists.py", req.query.name]);

    process.stdout.on("data", function (data) {
      console.log(data.toString().trim());
      data = data.toString().trim();

      res.send(data.toString()); //res.send(data.toString());
    });
  } catch (e) {
    res.send({ status: "failed" });
  }
}
function analytic(req, res) {
  try {
    var spawn = require("child_process").spawn;

    var process = spawn("python3", ["./getspam.py", req.query.name]);

    process.stdout.on("data", function (data) {
      data = data.toString().trim();
      console.log(data);
      if (data.length) {
        res.send(data.toString());
      } else {
        res.send({ status: "failed" });
      }
    });
  } catch (e) {
    res.send({ status: "failed" });
  }
}
function analyticall(req, res) {
  try {
    var spawn = require("child_process").spawn;

    var process = spawn("python3", ["./getall.py"]);

    process.stdout.on("data", function (data) {
      data = data.toString().trim();
      console.log(data);
      if (data.length) {
        res.send(data.toString());
      } else {
        res.send({ status: "failed" });
      }
    });
  } catch (e) {
    res.send({ status: "failed" });
  }
}
function getFraud(req, res) {
  //console.log(req.query);
  try {
    var spawn = require("child_process").spawn;
    console.log(req.query.src, req.query.des, req.query.ammount);

    var process = spawn("python3", [
      "./original.py",
      req.query.src,
      req.query.des,
      req.query.ammount,
    ]);

    process.stdout.on("data", function (data) {
      data = data.toString().trim();
      console.log(data);
      if (data.length) {
        res.send(data.toString().trim());
      } else {
        res.send({ status: "failed" });
      }
    });
  } catch (e) {
    res.send({ status: "failed" });
  }
}
function writecsv(req, res) {
  //console.log(req.query);
  try {
    var spawn = require("child_process").spawn;
    console.log(req.query.src, req.query.des, req.query.ammount);

    var process = spawn("python3", [
      "./writepls.py",
      req.query.src,
      req.query.des,
      req.query.ammount,
    ]);

    process.stdout.on("data", function (data) {
      data = data.toString().trim();
      console.log(data);
      if (data.length) {
        res.send(data.toString());
      } else {
        res.send({ status: "failed" });
      }
    });
  } catch (e) {
    res.send({ status: "failed" });
  }
}

function callName(req, res) {
  console.log("Inside name finder", req.query.name);
  try {
    var spawn = require("child_process").spawn;

    var process = spawn("python3", ["./faceRecog.py", req.query.name]);

    process.stdout.on("data", function (data) {
      console.log("Result is Data");
      res.send(data.toString());
    });
  } catch (e) {
    res.send({ status: "failed" });
  }
}
const write = async (req, res, next) => {
  var spawn = require("child_process").spawn;
  console.log("Ammount is", req.query.ammount);
  var process = spawn("python3", [
    "./spam.py",
    req.query.name,
    req.query.ammount,
    req.query.time,
  ]);
  try {
    process.stdout.on("data", function (data) {
      console.log("Result is", data.toString());
      res.send(data.toString());
    });
  } catch (e) {
    res.send({ status: "failed" });
  }
};

app.post("/upload/image", uploadImage);
app.post("/upload/setup", setup);
app.post("/write", write);
app.post("/fetch_external_image", async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).send("imageUrl param required");
  }
  try {
    const externalResponse = await request(imageUrl);
    res.set("content-type", externalResponse.headers["content-type"]);
    return res.status(202).send(Buffer.from(externalResponse.body));
  } catch (err) {
    return res.status(404).send(err.toString());
  }
});

app.listen(8000, () => console.log("Listening on port 8000!"));

function request(url, returnBuffer = true, timeout = 10000) {
  return new Promise(function (resolve, reject) {
    const options = Object.assign(
      {},
      {
        url,
        isBuffer: true,
        timeout,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
        },
      },
      returnBuffer ? { encoding: null } : {}
    );

    get(options, function (err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  });
}
