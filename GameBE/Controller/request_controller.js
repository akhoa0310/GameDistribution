    import { createRequest,acceptRequest,rejectRequest,getRequestsWithUserNames} from "../DB/Actions/request_action.js";

    // API gửi request
    export const handleCreateRequest = async (req, res) => {
        const user_id = req.user.id;  
        const reason = req.body.reason;

        try {
            const request = await createRequest(user_id, reason);
            res.status(201).json({ success: true, data: request });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    };

    // API duyệt request
    export const handleAcceptRequest = async (req, res) => {
        const { requestId } = req.params;
    
        try {
        const { request, user } = await acceptRequest(requestId);
        res.status(200).json({
            success: true,
            data: {
            request,
            updatedUser: user,
            },
        });
        } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        }
    };
    
    // API từ chối request
    export const handleRejectRequest = async (req, res) => {
        const { requestId } = req.params;
    
        try {
        const request = await rejectRequest(requestId);
        res.status(200).json({
            success: true,
            data: request,
        });
        } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        }
    };
    export const handleGetRequestsWithUserNames = async (req, res) => {
        try {
        const requests = await getRequestsWithUserNames();
        res.status(200).json({ success: true, data: requests });
        } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        }
    };
    