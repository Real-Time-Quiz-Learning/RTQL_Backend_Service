export class AdminService {
    constructor() {
        this._apiStats = {};
        this._apiStats['totalRequests'] = 0;
        this._apiStats['endpointStats'] = [];
        this._apiStats['userStats'] = [];

        this.b_apiStatsMiddleware = this._apiStatsMiddleware.bind(this);
    }

    _apiStatsMiddleware(req, res, next) {
        this._apiStats['totalRequests'] += 1;

        // Endpoint stats
        let endpoint = req.baseUrl;
        let endpointStatsIdx = this._apiStats.endpointStats.findIndex(e => e.endpoint === endpoint);

        if (endpointStatsIdx > -1) {
            this._apiStats.endpointStats[endpointStatsIdx].totalRequests += 1;
            this._apiStats.endpointStats[endpointStatsIdx].methods[req.method] += 1;

        } else {
            let endpointStats = {};
            endpointStats.endpoint = endpoint;
            endpointStats.totalRequests = 1;
            endpointStats.methods = {};
            endpointStats.methods[req.method] = 1;

            this._apiStats.endpointStats.push(endpointStats);
        }

        // User stats
        let validUser = req.validUser;
        let userId = validUser ? validUser.response.id : 'anonymous';    
        let userStatsIdx = this._apiStats.userStats.findIndex(u => u.id == userId);

        if (userStatsIdx > -1) {
            this._apiStats.userStats[userStatsIdx].totalRequests += 1;
        } else {
            let userStats = {};
            userStats.id = userId;
            userStats.email = validUser ? validUser.response.email : null;
            userStats.totalRequests = 1;

            this._apiStats.userStats.push(userStats);
        }

        // Information logging
        console.log(endpoint);
        console.log(JSON.stringify(this._apiStats));

        next();
    }

    // userStats(userId) {
    //     let userStats = this._apiStats.userStats[userId] || {};
    //     userStats.totalRequests = (userStats.totalRequests || 0) + 1;
    //     this._apiStats.userStats[userId] = userStats;
    // }

    getApiStats() {
        return this._apiStats;
    }
}
