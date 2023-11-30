import NoPage from "./NoPage";
import { useParams } from "react-router-dom";
import axios from "axios";

function ProjectDashboard() {
    const { projectId } = useParams();

    return (
        <>
            <h1>Project ID: {projectId}</h1>
        </>
    );
}

export default ProjectDashboard;