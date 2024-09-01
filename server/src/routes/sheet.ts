import { Router } from "express";
import SheetController from "../controllers/sheet";
import verifyToken from "../middlewares/verifyToken";
const router = Router();
<<<<<<< HEAD
=======

router.post("/:sheetId/addUsertoSheet", SheetController.addUserToSheet);
>>>>>>> 24b1e92d4b58a1561b3fdd229111f7659ff10a0b
router.use(verifyToken);
router.post("/create", SheetController.createSheet);
router.get("/:sheetId/detail", SheetController.getSheetById);
router.get("/list", SheetController.getSheetList);
router.put("/:sheetId/update", SheetController.updateSheetById);
router.delete("/:sheetId/remove", SheetController.removeSheetById);

export default router;
