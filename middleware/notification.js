const sendNotificationToAdmin = (io) => (req, res, next) => {
    const { dealId } = req.params;
    const { comment, user_name } = req.body;

    const notificationData = {
        dealId,
        comment,
        user_name,
        time: new Date(),
    };

    io.emit('newCommentNotification', notificationData);

    next();
};

module.exports = sendNotificationToAdmin;