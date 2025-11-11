import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { ChevronDown } from "lucide-react";
import Checkbox from "@mui/material/Checkbox";

export default function ControlledAccordions({ data }) {
    const [expanded, setExpanded] = useState("panel1");

    // Callback to handle expansion per panel
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : null);
    };

    console.log("expanded", expanded);
    return (
        <div>
            {data?.map((dataItem, index) => {
                const panelId = `panel${index + 1}`;
                return (
                    <Accordion key={panelId} expanded={expanded === panelId} onChange={handleChange(panelId)}>
                        <AccordionSummary expandIcon={<ChevronDown size={20} />} aria-controls={`${panelId}-content`} id={`${panelId}-header`}>
                            <Checkbox checked={expanded === panelId} tabIndex={-1} disableRipple sx={{ mr: 1 }} />
                            <Typography sx={{ fontWeight: 500, mr: 2 }}>{dataItem.title}</Typography>
                            <Typography sx={{ color: "text.secondary" }}>{dataItem.summary}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography component="div">{dataItem.details}</Typography>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    );
}
