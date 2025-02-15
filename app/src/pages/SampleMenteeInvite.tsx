import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { ReactComponent as SendIcon } from '../assets/send.svg';
import { ring2 } from 'ldrs';

interface InviteFormData {
    email: string;
    verifyEmail: string;
}

const SampleMenteeInvite: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch } = useForm<InviteFormData>();

    ring2.register();

    const onSubmit = async (data: InviteFormData) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/users/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: data.email,
                    role: 'mentee',
                }),
            });

            if (response.ok) {
                toast.success('Invite sent successfully!', {
                    style: {
                        background: '#10B981',
                        color: '#fff',
                    },
                });
            } else {
                throw new Error('Failed to send invite');
            }
        } catch (error) {
            toast.error('Failed to send invite');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="card-title h4 mb-4">Invite Mentee</h2>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address'
                                            }
                                        })}
                                        className="form-control"
                                        type="email"
                                    />
                                    {errors.email && (
                                        <div className="text-danger small">{errors.email.message}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Verify Email</label>
                                    <input
                                        {...register('verifyEmail', {
                                            required: 'Please verify email',
                                            validate: (value: string) => value === watch('email') || 'Emails do not match'
                                        })}
                                        className="form-control"
                                        type="email"
                                    />
                                    {errors.verifyEmail && (
                                        <div className="text-danger small">{errors.verifyEmail.message}</div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                >
                                    {isLoading ? (
                                        <l-ring-2
                                            size="20"
                                            stroke="3"
                                            bg-opacity="0"
                                            speed="2"
                                            color="white"
                                        />
                                    ) : (
                                        <>
                                            <SendIcon className="me-2" style={{ width: '1.25rem', height: '1.25rem' }} />
                                            <span>Send Invite</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SampleMenteeInvite;
