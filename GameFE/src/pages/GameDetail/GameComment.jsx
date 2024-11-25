import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup, InputGroup, FormControl } from 'react-bootstrap';

const CommentSection = ({ slug }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    // Tải danh sách bình luận khi component được mount
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/${slug}/comments`);
                const data = await response.json();
                if (data.message === 'Comments retrieved successfully') {
                    setComments(data.data); // Cập nhật danh sách bình luận
                }
            } catch (error) {
                console.error('Failed to load comments:', error);
            }
        };

        fetchComments();
    }, [slug]);  // Lần tải lại khi slug thay đổi

    // Xử lý khi gửi bình luận mới
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        setLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/games/${slug}/comments`, {
                method: 'POST',
                credentials:"include", // Đảm bảo gửi cookie nếu cần
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });

            if (response.ok) {
                const addedComment = await response.json();
                setComments((prevComments) => [addedComment.data, ...prevComments]); // Thêm bình luận mới vào đầu
                setNewComment(''); // Reset input
            } else {
                console.error('Failed to submit comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Bình luận</h2>

            {/* Phần gửi bình luận */}
            <Form onSubmit={handleCommentSubmit} className="mb-4">
                <InputGroup>
                    <FormControl
                        as="textarea"
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                    />
                </InputGroup>
                <Button
                    variant="primary"
                    type="submit"
                    disabled={loading || !newComment.trim()}
                    className="mt-2"
                >
                    {loading ? 'Đang gửi...' : 'Gửi bình luận'}
                </Button>
            </Form>

            {/* Danh sách bình luận */}
            <ListGroup>
                {comments.map((comment) => (
                    <ListGroup.Item key={comment.cmt_id}>
                        <strong>{comment.User?.user_name || comment.user_name}</strong> {/* Sử dụng optional chaining và fallback */}
                        ({new Date(comment.time).toLocaleString()})
                        <p>{comment.content}</p>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default CommentSection;
