module.exports = function(data) {
	let work = {
		jobs: [],
		total: 0
	};
	for (let i in data) {
		work.jobs[i] = data[i];
		work.total += work.jobs[i].time;
		work.jobs[i].start = new Date(work.jobs[i].start * 1000).toLocaleDateString(
			"en-US",
			{
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric"
			}
		);
		work.jobs[i].numDateAdded = work.jobs[i].dateAdded;
		work.jobs[i].dateAdded = new Date(
			work.jobs[i].dateAdded * 1000
		).toLocaleDateString("en-US", {
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric"
		});
		work.jobs[i].time = [
			Math.floor(work.jobs[i].time / 3600),
			Math.floor((work.jobs[i].time % 3600) / 60)
		];
	}

	work.total = [
		Math.floor(work.total / 3600),
		Math.floor((work.total % 3600) / 60)
	];

	return work;
};
