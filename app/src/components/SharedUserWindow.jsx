"use client"
import { useState, useTransition } from "react"
import "../assets/style/sharedUserWindow.css"
import { shareProject, removeSharedUser } from "@/app/dashboard/actions"
import { Trash } from "lucide-react"

export default function SharedUserWindow({ projectId, title, users, onClose, onRemoveSuccess }) {
    const [email, setEmail] = useState('')
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState('')

    const handleShare = async () => {
        if (!email) return;
        setError('');

        startTransition(async () => {
            try {
                await shareProject(projectId, email);
                setEmail('');
            } catch (err) {
                setError(err.message);
            }
        });
    }

    const handleRemove = async (targetEmail) => {
        setError('');
        startTransition(async () => {
            try {
                const result = await removeSharedUser(projectId, targetEmail);
                if (result.success) {
                    onRemoveSuccess(targetEmail);
                }
            } catch (err) {
                setError(err.message);
            }
        });
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="window-container" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2>Project <strong>{title}</strong> - Sharing</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>
                
                <p className="description">Please write here the email of the user you want to share</p>
                
                <div className="input-group">
                    <input 
                        type="email" 
                        placeholder="example@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isPending}
                    />
                    <button 
                        className="btn-add" 
                        onClick={handleShare}
                        disabled={isPending || !email}
                    >
                        {isPending ? "Processing..." : "Share"}
                    </button>
                </div>

                {error && <p className="error-text" style={{color: 'red', fontSize: '0.8rem', marginTop: '10px'}}>{error}</p>}

                <div className="user-shared-container">
                    <h3>Shared with:</h3>
                    {users.length === 0 ? (
                        <p className="empty-msg">No person shared yet.</p>
                    ) : (
                        <ul className="user-list">
                            {users.map((u, index) => (
                                <li key={index} className="user-item">
                                    <div>
                                        <span className="user-icon">👤</span>
                                        {u.email}
                                    </div>
                                    <button 
                                        className="delete"
                                        onClick={() => handleRemove(u.email)}
                                        disabled={isPending}
                                        title="Remove user"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}