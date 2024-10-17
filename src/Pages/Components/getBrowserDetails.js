export const getBrowserDetails = () => {
    try {
        const { userAgent, appVersion, platform, language } = navigator;

        const browserName = (() => {
            const ua = userAgent.toLowerCase();
            if (ua.indexOf('chrome') > -1 && ua.indexOf('edge') === -1 && ua.indexOf('edg') === -1) return 'Chrome';
            if (ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1) return 'Safari';
            if (ua.indexOf('firefox') > -1) return 'Firefox';
            if (ua.indexOf('edg') > -1 || ua.indexOf('edge') > -1) return 'Edge';
            if (ua.indexOf('opr') > -1 || ua.indexOf('opera') > -1) return 'Opera';
            return ua;
        })();

        return {
            userAgent,
            browserName,
            appVersion,
            platform,
            language,
        };
    } catch (error) {
        throw new Error('Failed to get browser details: ' + error.message);
    }
};  