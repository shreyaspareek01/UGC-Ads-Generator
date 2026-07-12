import { useEffect, useState, useCallback, useRef } from "react";
import type { Project } from "../types";
import { ImageIcon, Loader2Icon, RefreshCwIcon, VideoIcon } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { GhostButton, PrimaryButton } from "../components/Buttons";
import { useAuthContext } from "../context/AuthContext";
import api from "../configs/axios";
import toast from "react-hot-toast";

const Result = () => {
    const { projectId } = useParams();
    const { user, updateCredits } = useAuthContext();
    const navigate = useNavigate();

    const [project, setProjectData] = useState<Project>({} as Project);
    const [loading, setLoading] = useState(true);
    const [generatingVideo, setGeneratingVideo] = useState(false);
    const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchProjectData = async () => {
        try {
            const { data } = await api.get(`/api/user/projects/${projectId}`);
            setProjectData(data.project);
            setLoading(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const pollStatus = useCallback(() => {
        pollingRef.current = setInterval(async () => {
            try {
                const { data } = await api.get(`/api/project/status/${projectId}`);
                setProjectData((prev) => ({ ...prev, ...data.project }));
                if (!data.project.isGenerating) {
                    if (pollingRef.current) clearInterval(pollingRef.current);
                    setGeneratingVideo(false);
                    if (data.project.error) {
                        toast.error(data.project.error);
                    } else {
                        toast.success("Video generated!");
                    }
                }
            } catch {
                if (pollingRef.current) clearInterval(pollingRef.current);
                setGeneratingVideo(false);
            }
        }, 3000);
    }, [projectId]);

    useEffect(() => {
        if (user && !project.id) {
            fetchProjectData();
        } else if (isLoaded && !user) {
            navigate("/");
        }
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleGenerateVideo = async () => {
        if (!user) return toast("Please login");
        if (!project.generatedImage) return toast("Generate an image first");
        if (project.generatedVideo) return toast("Video already exists");

        try {
            setGeneratingVideo(true);
            const { data } = await api.post(`/api/project/generate-video/${projectId}`);
            toast.success(data.message);
            if (user) updateCredits(user.credits - 10);
            pollStatus();
        } catch (error: any) {
            setGeneratingVideo(false);
            toast.error(error?.response?.data?.message || error.message);
        }
    };

    const isLoaded = !loading;

    return loading ? (
        <div className="h-screen w-full flex items-center justify-center">
            <Loader2Icon className="animate-spin text-indigo-400 size-9" />
        </div>
    ) : (
        <div className="min-h-screen text-white p-6 md:p-12 mt-20">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-medium">Project Result</h1>
                    <Link to="/generate" className="btn-secondary text-sm flex items-center gap-2">
                        <RefreshCwIcon className="w-4 h-4" />
                        <p>New Generation</p>
                    </Link>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass-panel inline-block p-2 rounded-2xl">
                            <div className={`${project?.aspectRatio === "9:16" ? "aspect-9/16" : "aspect-video"} sm:max-h-200 rounded-xl bg-gray-900 overflow-hidden`}>
                                {project?.isGenerating ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                                        <Loader2Icon className="size-8 animate-spin text-indigo-400" />
                                        <p className="text-sm">Generating...</p>
                                    </div>
                                ) : project?.generatedImage
                                    ? <img src={project.generatedImage} alt="Result" className="w-full h-full object-cover" />
                                    : <div className="w-full h-full flex items-center justify-center text-gray-500">No image yet</div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-xl font-semibold mb-4">Actions</h3>
                            <div className="flex flex-col gap-3">
                                <a href={project.generatedImage?.replace("/upload", "/upload/fl_attachment")} download>
                                    <GhostButton disabled={!project.generatedImage} className="w-full justify-center rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <ImageIcon className="size-4.5" />
                                        Download Image
                                    </GhostButton>
                                </a>

                                {project.generatedVideo ? (
                                    <a href={project.generatedVideo?.replace("/upload", "/upload/fl_attachment")} download>
                                        <GhostButton className="w-full justify-center rounded-md py-3">
                                            <VideoIcon className="size-4.5" />
                                            Download Video
                                        </GhostButton>
                                    </a>
                                ) : (
                                    <PrimaryButton
                                        onClick={handleGenerateVideo}
                                        disabled={!project.generatedImage || generatingVideo || project.isGenerating}
                                        className="w-full justify-center rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {generatingVideo ? (
                                            <>
                                                <Loader2Icon className="size-4 animate-spin" />
                                                Generating Video...
                                            </>
                                        ) : (
                                            <>
                                                <VideoIcon className="size-4.5" />
                                                Generate Video (10 credits)
                                            </>
                                        )}
                                    </PrimaryButton>
                                )}
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-2xl">
                            <h3 className="text-lg font-semibold mb-2">{project.productName}</h3>
                            {project.productDescription && (
                                <p className="text-gray-400 text-sm mb-2">{project.productDescription}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-3">
                                Aspect ratio: {project.aspectRatio}
                            </div>
                            <div className="text-xs text-gray-500">
                                Created: {new Date(project.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Result;
