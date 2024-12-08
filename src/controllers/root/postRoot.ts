import { RequestHandler } from "express";
import * as XLSX from "xlsx";

const postRoot: RequestHandler = (req, res) => {
    try {
        const file = req.file; 
        if (!file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const filePath = file.path; 
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const groupCounts: { [group: string]: number } = {};
        const keyword = "Groups";

        worksheet.forEach((row: any) => {
            const comments = `${row["Additional comments"] || ""} ${row["Comments and Work notes"] || ""}`;
            if (comments) {
                const regex = new RegExp(`${keyword} : \\[code\\]<I>(.*?)</I>\\[/code\\]`, "g");
                let match;

                while ((match = regex.exec(comments)) !== null) {
                    const groups = match[1].split(",").map((g) => g.trim());
                    groups.forEach((group) => {
                        groupCounts[group] = (groupCounts[group] || 0) + 1;
                    });
                }
            }
        });

        let plainTextResponse = "Group_name                Number of occurrences\n";
        plainTextResponse += "-------------------------------------------------\n";

        Object.entries(groupCounts).forEach(([groupName, count]) => {
            plainTextResponse += `${groupName.padEnd(25)} ${count}\n`;
        });

        res.setHeader("Content-Type", "text/plain");
        res.send(plainTextResponse);
    } catch (error) {
        console.error("Error processing the file:", error);
        res.status(500).json({ error: "An error occurred while processing the data." });
    }
};

export default postRoot;
