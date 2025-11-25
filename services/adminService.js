export class AdminService {
    constructor() {
        this._apiStats = {};
        this._apiStats['totalRequests'] = 0;
        this._apiStats['endpointStats'] = {};
        this._apiStats['userStats'] = {};

        this.b_apiStatsMiddleware = this._apiStatsMiddleware.bind(this);
    }

    _apiStatsMiddleware(req, res, next) {
        this._apiStats['totalRequests'] += 1;

        let url = req.originalUrl.split('?')[0];            // strip the query params
        let endpointStats = this._apiStats.endpointStats[url];

        // If there is an authorization header, track user stats

        // Endpoint status regardless
        if (!endpointStats) {
            endpointStats = {};
            endpointStats.totalRequests = 1
            endpointStats.methods = {};
            endpointStats.methods[req.method] = 1;

        } else {
            endpointStats.totalRequests += 1;
            endpointStats.methods[req.method] += 1;
        }

        this._apiStats.endpointStats[url] = endpointStats;

        console.log(req.originalUrl);
        console.log(url);
        console.log(JSON.stringify(this._apiStats));

        next();
    }

    getApiStats() {
        return this._apiStats;
    }
}
