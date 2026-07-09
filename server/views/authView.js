export function loginSuccessResponse(user, accessToken) {
    return {
        success: true,
        message: "Вы успешно вошли в аккаунт",
        accessToken,
        user: {
            id: user.id,
            login: user.login,
            username: user.username,
            email: user.email,
            avatar_url: user.avatar_url,
            full_name: user.full_name,
            about: user.about,
            status: user.status,
            last_seen_at: user.last_seen_at
        }
    };
}

export function loginErrorResponse(errorMessage) {
    return {
        success: false,
        error: errorMessage
    };
}

export function registerSuccessResponse(user, accessToken) {
    return {
        success: true,
        message: "Регистрация прошла успешно",
        accessToken,
        user: {
            id: user.id,
            login: user.login,
            username: user.username,
            email: user.email,
            avatar_url: user.avatar_url,
            full_name: user.full_name,
            about: user.about,
            status: user.status,
            last_seen_at: user.last_seen_at
        }
    };
}

export function registerErrorResponse(errorMessage) {
    return {
        success: false,
        error: errorMessage
    };
}