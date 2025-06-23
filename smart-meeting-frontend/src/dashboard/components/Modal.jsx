import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Link, setRef, Typography } from "@mui/material";
import Loader from "./Loader";
import { useState } from "react";

const Modal = ({ selectedEvent, modalOpen, setModalOpen, setRefresh }) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [isLoading, setIsLoading] = useState(false);
    const handleDelete = async () => {
        console.log("Deleting event:", selectedEvent);
        const isConfirmed = window.confirm("Are you sure you want to delete this event?");
        if (!isConfirmed) return;
        try {
            setIsLoading(true);
            const response = await fetch(`${baseUrl}/calendar/events/delete?email=${localStorage.getItem("email")}&eventId=${selectedEvent.id}`, {
                method: "DELETE"
            });
            if (response.ok) {
                // alert("Event deleted successfully!");
                setIsLoading(false);
                setModalOpen(false);
                setRefresh((prev) => !prev);
            }
        } catch (error) {
            setIsLoading(false);
            console.error("Error deleting event:", error);
        }
    };
    return (<>
        {
            selectedEvent && (

                <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth>
                    <Loader open={isLoading} />
                    <DialogTitle>{selectedEvent.title}</DialogTitle>
                    <DialogContent dividers>
                        <Typography variant="subtitle1"> Description: </Typography>
                        <Typography gutterBottom>{selectedEvent.description}</Typography>
                        <Typography variant="subtitle1">
                            Start:
                        </Typography>
                        <Typography gutterBottom>
                            {new Date(selectedEvent.start).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, })}
                        </Typography>
                        <Typography variant="subtitle1">
                            End:
                        </Typography>
                        <Typography gutterBottom>
                            {new Date(selectedEvent.end).toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false, })}
                        </Typography>

                        {selectedEvent.attachments.length > 0 && (
                            <>
                                <Typography variant="subtitle1" sx={{ mt: 2 }}>
                                    Attachments:
                                </Typography>
                                {selectedEvent.attachments.map((file, index) => (
                                    <Typography key={index}>
                                        <Link href={file.fileUrl} target="_blank" rel="noopener">
                                            {file.title}
                                        </Link>
                                    </Typography>
                                ))}
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setModalOpen(false)}>Close</Button>
                        <Button variant="text" color="error" onClick={() => handleDelete()}>Delete</Button>
                    </DialogActions>
                </Dialog>)
        }
    </>)
}

export default Modal;