const Mission = require("../models/missions");

class MissionController {
  static async getAllMissions(req, res) {
    try {
      const missions = await Mission.getAll();
      res.json(missions);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mendapat data misi",
      });
    }
  }

  static async createMission(req, res) {
    try {
      const { nama, description, coord, date } = req.body;

      // Validate required fields
      if (
        !nama ||
        !Array.isArray(coord) ||
        !coord.every((point) => Array.isArray(point) && point.length === 2) ||
        !date
      ) {
        return res.status(400).json({
          status: "error",
          message: "Data misi tidak valid",
        });
      }

      // Create a new mission
      const newMission = await Mission.create({
        nama,
        description,
        coord,
        date,
      });

      res.status(201).json(newMission);
    } catch (error) {
      console.error("Error creating mission:", error);
      res.status(500).json({
        status: "error",
        message: "Gagal membuat misi",
      });
    }
  }

  static async updateMission(req, res) {
    try {
      const { nama, description, coord, date } = req.body;
      if (!nama || !coord || !date || !Array.isArray(coord)) {
        return res.status(400).json({
          status: "error",
          massage: "Data misi tidak valid",
        });
      }

      const updateMission = await Mission.update(req.params.id, {
        nama,
        description,
        coord,
        date,
      });
      if (!updateMission) {
        return res.status(404).json({
          status: "error",
          massage: "Misi tidak ditemukan",
        });
      }
      res.json(updateMission);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal memperbarui misi",
      });
    }
  }

  static async getMissionById(req, res) {
    try {
      const mission = await Mission.getById(req.params.id);
      if (!mission) {
        return res.status(404).json({
          status: "error",
          message: "Misi tidak ditemukan",
        });
      }
      res.json(mission);
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Gagal mengambil data misi",
      });
    }
  }

  static async deleteMission(req, res) {
    try {
      const deleted = await Mission.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({
          status: "error",
          massage: "misi tidak ditemukan",
        });
      }
      res.json({
        status: "sucsess",
        massage: "misi berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        massage: "gagal menghapus misi",
      });
    }
  }

  static async deleteMarkerFromMission(req, res) {
    const { missionId, markerIndex } = req.params;

    try {
      const mission = await Mission.findById(missionId);
      if (!mission) {
        return res.status(404).json({ message: "Misi tidak ditemukan" });
      }

      if (mission.path && mission.path[markerIndex]) {
        mission.path.splice(markerIndex, 1);
        await mission.save();
        return res.status(200).json(mission);
      } else {
        return res
          .status(400)
          .json({ message: "Marker tidak ditemukan di misi" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}

module.exports = MissionController;
