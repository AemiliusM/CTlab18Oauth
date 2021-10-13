const User = require('../models/User');
const {
  exchangeCodeForToken,
  getUserProfile,
} = require('../utils/githubToken');

module.exports = class UserSerive {
  static async create(code) {
    const accessToken = await exchangeCodeForToken(code);
    const profileBody = await getUserProfile(accessToken);
    console.log('profile', profileBody);
    let user = await User.findByUserName(profileBody.login);

    if (!user) {
      user = await User.insert({
        login: profileBody.login,
        avatar: profileBody.avatar,
      });
    } else { 
      await User.updatedById(user.id, { avatar: profileBody.avatar }); 
    }

    return user;
  }
};
