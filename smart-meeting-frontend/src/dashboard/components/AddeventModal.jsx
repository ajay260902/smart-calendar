import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Typography,
    Stack,
    Backdrop
} from "@mui/material";
import dayjs from 'dayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Loader from "./Loader";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const AddEventModal = ({ open, onClose, newEventData, setRefresh }) => {
    const [form, setForm] = useState({
        summary: "",
        description: "",
        file: null,
    });
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("CLICKED EVENT DATA:", newEventData);
        if (newEventData.startDateTime && newEventData.endDateTime) {
            setStartTime(dayjs.tz(newEventData.startDateTime, "Asia/Kolkata"));
            setEndTime(dayjs.tz(newEventData.endDateTime, "Asia/Kolkata"));
        }
    }, [newEventData]);

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("email", localStorage.getItem("email"));
        formData.append("summary", form.summary);
        formData.append("description", form.description);
        formData.append("startDateTime", startTime.toISOString());
        formData.append("endDateTime", endTime.toISOString());
        if (form.file) formData.append("file", form.file);
        console.log("BODY DATA:", formData, form)
        try {
            setIsLoading(true);
            const res = await fetch(`${baseUrl}/calendar/events`, {
                method: "POST",
                body: formData,
            });
            if (res.ok) {
                onClose();
                setForm({ summary: "", description: "", file: null });
                setRefresh((prev) => !prev);
            }
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <Loader open={isLoading} />
                <DialogTitle>Add Event</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Title"
                            fullWidth
                            value={form.summary}
                            onChange={(e) => setForm({ ...form, summary: e.target.value })}
                        />
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Date"
                                value={startTime}
                                disabled
                                format="DD/MM/YYYY"
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        variant: "outlined",
                                    },
                                }}
                            />
                            <TimePicker
                                label="Start Time"
                                value={startTime}
                                onChange={(newTime) => {
                                    if (newTime) {
                                        const updated = startTime
                                            .hour(newTime.hour())
                                            .minute(newTime.minute())
                                            .second(0);
                                        setStartTime(updated);
                                    }
                                }}
                                minutesStep={1}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        variant: "outlined",
                                        sx: { mt: 2 },
                                    },
                                }}
                            />
                            <TimePicker
                                label="End Time"
                                value={endTime}
                                onChange={(newTime) => {
                                    if (newTime) {
                                        const updated = endTime
                                            .set("date", endTime.date())
                                            .hour(newTime.hour())
                                            .minute(newTime.minute());
                                        setEndTime(updated);
                                    }
                                }}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        variant: "outlined",
                                        sx: { mt: 2 },
                                    },
                                }}
                            />
                        </LocalizationProvider>

                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<UploadFileIcon />}
                        >
                            {form.file ? form.file.name : "Choose File"}
                            <input
                                type="file"
                                hidden
                                onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                            />
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AddEventModal;