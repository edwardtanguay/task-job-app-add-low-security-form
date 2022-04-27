import { useState, useEffect } from 'react';
import './App.scss';
import _jobs from './data/jobs.json';
import { JobsFull } from './components/JobsFull';
import { JobsList } from './components/JobsList';
import md5 from 'md5';

_jobs.forEach((job) => {
	job.status = 'accepted';
});

const techItemsUrl = 'https://edwardtanguay.netlify.app/share/techItems.json';

const statuses = ['send', 'wait', 'interview', 'declined', 'accepted'];

function App() {
	const [displayKind, setDisplayKind] = useState('');
	const [jobs, setJobs] = useState([]);
	const [techItems, setTechItems] = useState([]);
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
	const [formLogin, setFormLogin] = useState('');
	const [formPassword, setFormPassword] = useState('');
	const [messageOnForm, setMessageForm] = useState('');

	const saveToLocalStorage = () => {
		if (displayKind !== '') {
			const jobAppState = {
				displayKind,
				jobs,
			};
			localStorage.setItem('jobAppState', JSON.stringify(jobAppState));
		}
	};

	const loadLocalStorage = () => {
		const jobAppState = JSON.parse(localStorage.getItem('jobAppState'));
		if (jobAppState === null) {
			setDisplayKind('list');
			setJobs(_jobs);
		} else {
			setDisplayKind(jobAppState.displayKind);
			setJobs(jobAppState.jobs);
		}
	};

	const loadTechItems = () => {
		(async () => {
			const response = await fetch(techItemsUrl);
			const data = await response.json();
			setTechItems(data);
		})();
	};

	useEffect(() => {
		loadLocalStorage();
		loadTechItems();
	}, []);

	useEffect(() => {
		saveToLocalStorage();
	}, [displayKind, jobs]);

	const handleToggleView = () => {
		const _displayKind = displayKind === 'full' ? 'list' : 'full';
		setDisplayKind(_displayKind);
	};

	const handleStatusChange = (job) => {
		let statusIndex = statuses.indexOf(job.status);
		statusIndex++;
		if (statusIndex > statuses.length - 1) {
			statusIndex = 0;
		}
		job.status = statuses[statusIndex];
		setJobs([...jobs]);
	};

	const handleSubmitButton = (e) => {
		e.preventDefault();
		const hash = md5(formPassword);
		if (hash === '8c6744c9d42ec2cb9e8885b54ff744d0') {
			setUserIsLoggedIn(true);
		} else {
			setMessageForm('bad login');
		}
	};

	const handleFormLogin = (e) => {
		setFormLogin(e.target.value);
	};

	const handleFormPassword = (e) => {
		setFormPassword(e.target.value);
	};

	return (
		<div className="App">
			<h1>Job Application Process</h1>

			{userIsLoggedIn ? (
				<>
					<div>There are {techItems.length} tech items.</div>
					<button onClick={handleToggleView}>Toggle View</button>
					{displayKind === 'full' ? (
						<JobsFull
							jobs={jobs}
							handleStatusChange={handleStatusChange}
							techItems={techItems}
						/>
					) : (
						<JobsList jobs={jobs} />
					)}
				</>
			) : (
				<form>
					<fieldset>
						<legend>Welcome</legend>
						{messageOnForm !== '' && (
							<div className="messageOnForm">{messageOnForm}</div>
						)}
						<div className="row">
							<label htmlFor="login">Login</label>
							<input
								autoFocus
								value={formLogin}
								onChange={(e) => handleFormLogin(e)}
								type="text"
								id="login"
							/>
						</div>
						<div className="row">
							<label htmlFor="password">Password</label>
							<input
								value={formPassword}
								onChange={(e) => handleFormPassword(e)}
								type="password"
								id="password"
							/>
						</div>
						<div className="buttonRow">
							<button onClick={(e) => handleSubmitButton(e)}>
								Enter
							</button>
						</div>
					</fieldset>
				</form>
			)}
		</div>
	);
}

export default App;
