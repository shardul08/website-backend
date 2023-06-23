const chai = require("chai");
const { expect } = chai;
const chaiHttp = require("chai-http");
const { userDeviceInfoDataArray } = require("../fixtures/userDeviceInfo/userDeviceInfo");

const app = require("../../server");
const cleanDb = require("../utils/cleanDb");

chai.use(chaiHttp);

describe("User Device Info", function () {
  let userDeviceInfoData;
  beforeEach(async function () {
    userDeviceInfoData = userDeviceInfoDataArray[0];
  });

  afterEach(async function () {
    await cleanDb();
  });

  describe("POST /userDeviceInfo", function () {
    it("Should return success response after storing user device info for mobile auth", function (done) {
      chai
        .request(app)
        .post("/auth/qr-code-auth")
        .send(userDeviceInfoData)
        .end((err, response) => {
          if (err) {
            return done(err);
          }
          expect(response).to.have.status(201);
          expect(response.body.userDeviceInfoData).to.be.an("object");
          expect(response.body.message).to.equal("User Device Info added successfully!");
          expect(response.body.userDeviceInfoData.user_id).to.be.a("string");
          expect(response.body.userDeviceInfoData.device_info).to.be.a("string");
          expect(response.body.userDeviceInfoData.device_id).to.be.a("string");

          return done();
        });
    });

    it("Should return a 500 status code and the correct error message when an error occurs while storing user device info", function (done) {
      chai
        .request(app)
        .post("/userDeviceInfo")
        .send({})
        .end((err, res) => {
          if (err) {
            return done();
          }
          expect(res).to.have.status(500);
          expect(res.body).to.eql({
            statusCode: 500,
            error: "Internal Server Error",
            message: "An internal server error occurred",
          });

          return done();
        });
    });
  });
});
