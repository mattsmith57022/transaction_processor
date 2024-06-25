import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TopBranches() {
    const [topBranches, setTopBranches] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/top-branches')
            .then(response => setTopBranches(response.data))
            .catch(error => console.error('Error fetching top branches', error));
    }, []);

    return (
        <div>
            <h2>Top 10 Branches by Average Amount</h2>
            <ul>
                {topBranches.map(branch => (
                    <li key={branch.branch_code}>
                        Code: {branch.branch_code} - Avg: {branch.avg_amount.toFixed(2)}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function BranchSearch() {
    const [branchCode, setBranchCode] = useState('');
    const [branch, setBranch] = useState(null);

    const handleSearch = () => {
        axios.get(`http://localhost:3001/api/branches/${branchCode}`)
            .then(response => setBranch(response.data))
            .catch(error => {
                console.error('Error fetching branch', error);
                setBranch(null); // Reset branch on error or not found
            });
    };

    return (
        <div>
            <h2>Search Branch</h2>
            <input
                type="text"
                value={branchCode}
                onChange={e => setBranchCode(e.target.value)}
                placeholder="Enter Branch Code"
            />
            <button onClick={handleSearch}>Search</button>
            {branch && (
                <div>
                    <h3>Branch Details</h3>
                    <p>Branch Code: {branch.branch_code}</p>
                    <p>Min Amount: {branch.min_amount}</p>
                    <p>Max Amount: {branch.max_amount}</p>
                    <p>Avg Amount: {branch.avg_amount.toFixed(2)}</p>
                </div>
            )}
        </div>
    );
}

function App() {
    const [data, setData] = useState([]);
    const [pageInfo, setPageInfo] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });

    const fetchData = (page = 1) => {
        axios.get(`http://localhost:3001/api/branches?page=${page}&limit=10`)
            .then(response => {
                setData(response.data.data);
                setPageInfo({
                    currentPage: page,
                    itemsPerPage: 10,
                    totalItems: response.data.pageInfo.totalItems,
                    totalPages: response.data.pageInfo.totalPages
                });
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="App">
            <h1>Branch Statistics Dashboard</h1>
            <TopBranches />
            <BranchSearch />
            <div>
                <h2>Branch Transactions Overview</h2>
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>{item.branch_code} - Min: {item.min_amount.toFixed(2)}, Max: {item.max_amount}, Avg: {item.avg_amount}</li>
                    ))}
                </ul>
                <div>
                    <button onClick={() => fetchData(pageInfo.currentPage - 1)} disabled={pageInfo.currentPage <= 1}>
                        Previous
                    </button>
                    <button onClick={() => fetchData(pageInfo.currentPage + 1)} disabled={pageInfo.currentPage >= pageInfo.totalPages}>
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
