import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Navbar from '../components/Navbar'
import { Box, Container } from '@mui/material'
import { useEffect, useState } from 'react'
import Modal from '../components/Modal'
import AddEventModal from '../components/AddeventModal'
import Loader from '../components/Loader'

const Dashboard = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [addEventOpen, setAddEventOpen] = useState(false);
    const [newEventData, setNewEventData] = useState({});
    const [refresh, setRefresh] = useState(false);

    // Get info from URL (sent from backend redirect)
    const params = new URLSearchParams(window.location.search)
    const email = params.get('email')

    const [isLoading, setIsLoading] = useState(false);

    localStorage.setItem('email', email)

    useEffect(() => {

        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${baseUrl}/calendar/events?email=${encodeURIComponent(email)}`)
                const data = await response.json()
                console.log("Fetched events:", data?.items)
                const transformed = data?.items?.map(e => ({
                    id: e.id,
                    title: e.summary,
                    start: e.start?.dateTime,
                    end: e.end?.dateTime,
                    extendedProps: {
                        description: e.description,
                        attachments: e.attachments || []
                    }
                }));

                setEvents(transformed);
            } catch (error) {
                console.error("Error fetching events:", error)
            } finally {
                setIsLoading(false);
            }
        }
        fetchEvents();
    }, [refresh])

    return (
        <Box>
            <Loader open={isLoading} />
            <Navbar email={email} />
            <Modal selectedEvent={selectedEvent} modalOpen={modalOpen} setModalOpen={setModalOpen} setRefresh={setRefresh} />

            <AddEventModal
                open={addEventOpen}
                onClose={() => setAddEventOpen(false)}
                newEventData={newEventData}
                setRefresh={setRefresh}
            />
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="auto"
                    dateClick={(arg) => {
                        setNewEventData({
                            startDateTime: arg.dateStr + "T10:00:00+05:30", // adjust time
                            endDateTime: arg.dateStr + "T11:00:00+05:30",
                        });
                        setAddEventOpen(true);
                    }}
                    eventClick={(info) => {
                        const { title, extendedProps, start, end,id } = info.event;
                        setSelectedEvent({
                            id,
                            title,
                            description: extendedProps?.description || "No description",
                            start,
                            end,
                            attachments: extendedProps?.attachments || []
                        });

                        setModalOpen(true);
                    }}
                />
            </Container>
        </Box>
    )
}

export default Dashboard