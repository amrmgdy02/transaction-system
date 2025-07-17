import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";

export const UserBalance = ({ user }) => {
    const [balanceData, setBalanceData] = useState({
        username: '',
        balance: 0,
        totalReceived: 0,
        totalSent: 0,
        isLoading: true
    });

    useEffect(() => {
        if (user?.username) {
            setBalanceData(prev => ({ ...prev, isLoading: true }));
            
            Meteor.callAsync("transactions.getUserBalance", user.username)
                .then(result => {
                    setBalanceData({ ...result, isLoading: false });
                })
                .catch(error => {
                    console.error('Error getting balance:', error);
                    setBalanceData(prev => ({ ...prev, isLoading: false }));
                });
        } else {
            setBalanceData(prev => ({ ...prev, isLoading: false }));
        }
    }, [user?.username]);

    if (balanceData.isLoading) {
        return <div>Loading balance...</div>;
    }

    return (
        <div>
            <h2>Balance Information</h2>
            <p>User: {balanceData.username}</p>
            <p>Balance: ${balanceData.balance?.toFixed(2) || '0.00'}</p>
            <p>Total Received: ${balanceData.totalReceived?.toFixed(2) || '0.00'}</p>
            <p>Total Sent: ${balanceData.totalSent?.toFixed(2) || '0.00'}</p>
        </div>
    );
}