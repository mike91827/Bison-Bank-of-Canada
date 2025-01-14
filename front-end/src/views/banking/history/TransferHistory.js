import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ListCard from 'ui-component/cards/ListCard';
import createData from 'utils/createData';
import bbcApi from '../../../api/bbcApi';
import { setUser } from '../../authentication/userSlice';

const TransferHistory = () => {
    let userInfo = useSelector((state) => state.user);
    let filterInfo = useSelector((state) => state.filter);
    let dispatch = useDispatch();

    window.addEventListener('load', async () => {
        if (userInfo === null || userInfo.userName === '') return;

        try {
            let user = await bbcApi.getUser(userInfo.userName);
            let action = setUser(user);
            dispatch(action);
        } catch (error) {
            console.log(error);
        }
    });

    let labels = ['Transfer Id', ' ', 'Receiver/Recipeint', 'Date', 'Amount'];
    let filterLabels = [
        { label: 'Sender', color: '#C22E28' },
        { label: 'Receiver', color: '#F95587' }
    ];
    let emptyMessage = 'You have not made or recieved any transfer so far. Send money to your friends to get started!';
    let title = 'Transfer History';

    let [rows, setRows] = useState(() => {
        let counter = 1;
        let temp = userInfo.transferHistory;
        let displayRows = temp.map((item) => {
            let data = { email: userInfo.userName, date: item.date, sender: item.sender, receiver: item.receiver, amount: item.amount };
            let row = createData('transfer', data);
            return { ...row, transNumber: counter++ };
        });
        return displayRows;
    });

    useEffect(() => {
        let counter = 1;
        let temp = userInfo.transferHistory;
        let displayRows = temp
            .filter((item) => {
                return (
                    (filterInfo.sender.length === 0 || filterInfo.sender.includes(item.sender)) &&
                    (filterInfo.receiver.length === 0 || filterInfo.receiver.includes(item.receiver))
                );
            })
            .map((item) => {
                let data = { email: userInfo.userName, date: item.date, sender: item.sender, receiver: item.receiver, amount: item.amount };
                let row = createData('transfer', data);
                return { ...row, transNumber: counter++ };
            });
        setRows(displayRows);
    }, [filterInfo, userInfo]);

    return (
        <ListCard
            labels={labels}
            rows={rows}
            emptyMessage={emptyMessage}
            title={title}
            filterData={userInfo.transferHistory}
            filterLabels={filterLabels}
        />
    );
};

export default TransferHistory;
