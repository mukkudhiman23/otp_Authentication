const User = require('../models').User;
const Otp = require("../models").Otp;
const config = require("../common/mailConfig");
const transporter = require("../common/configration");
const moment = require('moment');

/**
 * Send the OTP to user
 */
async function sendOTP(email, randomOTP) {
  let mailOptions = {
    from: config.from,
    to: email,
    subject: "OTP Authentication Demo",
    text: "OTP for email varification " + randomOTP,
  };
  await transporter.sendMail(mailOptions);
}

exports.registerUser = async (data) => {
  try {
    let randomOTP = Math.floor(100000 + Math.random() * 900000);

    const existingUser = await User.findOne({
      where: {
        email: data.email
      }
    });
    console.log(existingUser);

    // if an user already exisis with same email
    if (existingUser) {
      // check if he is verified
      if (existingUser.status) {
        return {
          status: 400,
          data: {
            msg: 'Email has been already taken.'
          }
        };
      }

      // unverified user check the otp time
      const otpData = await Otp.findOne({
        where: {
          user_id: existingUser.id
        }
      });

      // we have an otp
      const lastUpdated = moment(otpData.updatedAt);
      const currentDate = moment().utc().subtract(1, 'day');

      // check if the otp has been sent 2 times
      if (otpData.tries >= 2 && (currentDate.isSame(lastUpdated) || currentDate.isBefore(lastUpdated))) {
        // return error as 24 hours not passed
        return {
          status: 400,
          data: {
            msg: 'You have exceed your OTP limit!'
          }
        };
      } else {
        // update the old otp
        let tries;
        if (otpData.tries >= 2) {
          tries = 0;
        } else {
          tries = otpData.tries + 1;
        }

        await otpData.update({
          otp: randomOTP,
          tries: tries
        });

        await sendOTP(existingUser.email, randomOTP);

        return {
          status: 200,
          data: {
            redirectTo: '/verify/' + existingUser.id,
            msg: "OTP has been sent successfully on your email!",
          },
        };
      }
    }

    const user = await User.create({
      username: data.username,
      email: data.email,
      status: 0
    });

    if (!user) {
      return {
        status: 400,
        data: {
          msg: "Something gone wrong",
        },
      };
    }

    const otp = await Otp.create({
      otp: randomOTP,
      tries: 0,
      user_id: user.id,
    });

    if (!otp) {
      return {
        status: 400,
        data: {
          msg: "Something gone wrong!!",
        },
      };
    }

    await sendOTP(user.email, randomOTP);

    return {
      status: 200,
      data: {
        redirectTo: '/verify/' + user.id,
        msg: "You have register successfully",
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      data: {
        msg: "Something went wrong!",
      },
    };
  }
};

exports.retryUser = async (params) => {
  try {
    const id = params.id;

    const userData = await User.findOne({
      where: { id: id, status: 0 },
    });

    if (!userData) {
      return {
        status: 400,
        data: {
          msg: "User does not exists!!",
        },
      };
    }

    const otpData = await Otp.findOne({
      where: { user_id: id },
    });

    if (!otpData) {
      return {
        status: 400,
        data: {
          msg: "OTP does not exists!",
        },
      };
    }

    if (otpData.tries >= 2) {
      return {
        status: 400,
        data: {
          msg: "Retry not possible more than 2 times!",
        },
      };
    }

    let randomOTP = Math.floor(100000 + Math.random() * 900000);
    const updatedOTP = await otpData.update({
      otp: randomOTP,
      tries: otpData.tries + 1,
    });

    await sendOTP(userData.email, randomOTP);

    return {
      status: 200,
      data: {
        msg: "OTP have been sent on your mail!",
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      data: {
        msg: "Something went wrong!",
      },
    };
  }
};

exports.verifyUser = async (data) => {
  try {
    const userData = await User.findOne({
      where: { id: data.user_id, status: 0 },
    });

    if (!userData) {
      return {
        status: 400,
        data: {
          msg: "User does not exists!",
        },
      };
    }

    const otpData = await Otp.findOne({
      where: { user_id: data.user_id, otp: data.otp },
    });

    if (!otpData) {
      return {
        status: 400,
        data: {
          msg: "Please enter valid otp!",
        },
      };
    }

    await otpData.destroy();

    await userData.update({
      status: 1
    })

    return {
      status: 200,
      data: {
        msg: "OTP verified!",
        redirectTo: '/'
      },
    };
  } catch (e) {
    console.log(e);
    return {
      status: 400,
      data: {
        msg: "Something went wrong!",
      },
    };
  }
};

exports.showVerify = async (data) => {
  const user = await User.findOne({
    where: {
      id: data,
      status: 0
    }
  });

  if (user) {
    return {
      status: 200,
      data: {
        msg: "user found successfully"
      }
    }
  }

  throw new Error('user does not exist');
}

