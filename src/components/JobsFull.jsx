export const JobsFull = ({ jobs, handleStatusChange, techItems }) => {
	const skillDefinitions = [
		{
			title: 'PHP',
			description: 'a server-side language created in the 90s',
		},
		{
			title: 'Go',
			description: "Google's new low-level language",
		},
	];

	const getSkillDescription = (skillTitle) => {
		return 'ddd';
	}

	const getSkillDefinitions = (job) => {
		const skillDefinitions = [];
		const skillTitles = job.skills.split(',');
		skillTitles.forEach((skillTitle) => {
			const description = getSkillDescription(skillTitle);
			if (description !== null) {
				const sd = {
					title: skillTitle,
					description,
				};
				skillDefinitions.push(sd);
			}
		});
		return skillDefinitions;
	};

	return (
		<div className="jobs">
			{jobs.map((job, index) => {
				return (
					<div key={index} className={`job ${job.status}`}>
						<div className="header">
							<div className="position">
								<a href={job.url}>{job.position}</a>
							</div>
							<button
								onClick={() => handleStatusChange(job)}
								className="status"
							>
								{job.status}
							</button>
						</div>
						<div className="skills">{job.skills}</div>
						{job.status !== 'declined' && (
							<div className="bulkText">{job.bulkText}</div>
						)}
						<ul className="skillDefinitions">
							{getSkillDefinitions(job).map((sd, index) => {
								return (
									<li>
										{sd.title} - {sd.description}
									</li>
								);
							})}
						</ul>
					</div>
				);
			})}
		</div>
	);
};
