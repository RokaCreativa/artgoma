import EventList from "./components/event-list";
import FormCreateEvent from "./components/FormCreateEvent";

const EventsPanelPage = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-start w-full h-full relative">
      <div className="w-full md:w-3/4 lg:w-1/3 z-50 flex flex-col p-4 md:p-6 rounded-xl bg-white/30 backdrop-blur-3xl shadow-xl shadow-gray-800">
        <div className="flex flex-col w-full mb-4">
          <p className="text-md md:text-2xl text-center text-white font-bold">Create Event</p>
        </div>

        <FormCreateEvent />
      </div>
      <EventList />
    </div>
  );
};

export default EventsPanelPage;
