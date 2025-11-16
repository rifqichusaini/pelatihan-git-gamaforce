const express = require("express");
const router = express.Router();
const MissionController = require("../controllers/missionControllers");

router.get("/", MissionController.getAllMissions);
router.post("/", MissionController.createMission);
router.put("/:id", MissionController.updateMission);
router.get("/:id", MissionController.getMissionById);
router.delete("/:id", MissionController.deleteMission);
router.delete(
  "/:missionId/marker/:markerIndex",
  MissionController.deleteMarkerFromMission
);

module.exports = router;
