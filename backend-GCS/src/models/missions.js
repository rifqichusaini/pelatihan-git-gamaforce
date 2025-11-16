const db = require("../config/missionDatabase");

class Mission {
  static createGeoJSON(coord) {
    return {
      type: "Feature",
      geometry: {
        type: "lineString",
        coordinates: coord.map(([lat, lng]) => [lat, lng]),
      },
    };
  }

  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM missions", [], (err, rows) => {
        if (err) {
          console.error("Database query error:", err);
          reject(err);
        } else {
          const missions = rows.map((row) => ({
            ...row,
            coord: row.coord ? JSON.parse(row.coord) : null,
            geoJSON: row.geoJSON ? JSON.parse(row.geoJSON) : null,
            description: row.description || null,
          }));
          resolve({ missions });
        }
      });
    });
  }

  static async create(missionData) {
    const { nama, description, date, coord } = missionData;
    const home = coord[0];
    const geoJSON = this.createGeoJSON(coord);

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO missions (nama, description, coord, home, date, geoJSON)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          nama,
          description || null,
          JSON.stringify(coord),
          JSON.stringify(home),
          date,
          JSON.stringify(geoJSON),
        ],
        function (err) {
          if (err) reject(err);
          resolve({
            mission_id: this.lastID,
            nama,
            description,
            coord,
            home,
            date,
            geoJSON,
          });
        }
      );
    });
  }

  static async update(id, missionData) {
    const { nama, description, coord, date } = missionData;
    const home = coord[0];
    const geoJSON = this.createGeoJSON(coord);

    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE missions
         SET nama = ?, description = ?, coord = ?, home = ?, date = ?, geoJSON = ?
         WHERE mission_id = ?`,
        [
          nama,
          description || null,
          JSON.stringify(coord),
          JSON.stringify(home),
          date,
          JSON.stringify(geoJSON),
          id,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            if (this.changes === 0) {
              resolve(null);
            } else {
              resolve({
                mission_id: id,
                nama,
                description,
                coord,
                home,
                date,
                geoJSON,
              });
            }
          }
        }
      );
    });
  }

  static async getById(id) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM missions WHERE mission_id = ?",
        [id],
        (err, row) => {
          if (err) reject(err);
          if (!row) resolve(null);
          const mission = {
            ...row,
            coord: JSON.parse(row.coord),
            home: JSON.parse(row.home),
            geoJSON: JSON.parse(row.geoJSON),
          };
          resolve(mission);
        }
      );
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.run("DELETE FROM missions WHERE mission_id = ?", [id], function (err) {
        if (err) reject(err);
        resolve(this.changes > 0);
      });
    });
  }
}

module.exports = Mission;
