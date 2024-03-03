export type TranslationStruct = {
	categories: {
		add: {
			submit: string,
			title: string
		},
		cancel: string,
		duplicate: string,
		label: {
			description: string,
			language: string,
			slug: string,
			title: string
		},
		locale: {
			add: string,
			update: string
		},
		no_records: string,
		remove: {
			button: string,
			confirm: string,
			title: string
		}
	},
	edit: {
		category: {
			added: string,
			deleted: string
		},
		error_saving: string,
		errors: {
			[key: string]: string
		},
		labels: {
			categories: string,
			language: string,
			slug: string,
			tags: string,
			title: string
		},
		new_locale: string,
		no_changes: string,
		placeholders: {
			tags: string,
			title: string
		},
		publish: {
			button: string,
			success: string
		},
		saved: string,
		submit: string
	},
	home: {
		message: string,
		published: {
			title: string
		},
		remove: {
			button: string,
			confirm: string,
			success: string,
			title: string
		},
		unpublished: {
			title: string
		}
	},
	media: {
		add: {
			cancel: string,
			descr: string,
			duplicate: string,
			thumb: {
				crop: string,
				duplicate: string,
				fit: string,
				height: string,
				type: string,
				width: string
			},
			title: string,
			upload: string
		},
		details: {
			dimensions: string,
			filename: string,
			mime: string,
			size: string,
			source: string,
			thumbnails: string
		},
		remove: {
			button: string,
			confirm: string,
			title: string
		},
		no_records: string,
		url_copied: string
	},
	media_filter: {
		filename: string,
		from: string,
		range: {
			explicit: string,
			last_week: string,
			last_two_weeks: string,
			last_thirty: string,
			last_ninety: string,
			last_year: string,
			this_month: string,
			this_year: string,
			today: string
		},
		my_uploads: string,
		to: string,
		whose: {
			mine: string
		}
	},
	media_select: {
		crop: string,
		fit: string,
		no_records: string,
		source: string,
		title: string
	},
	meta: {
		labels: {
			description: string,
			image: string,
			title: string,
			url: string
		},
		placeholders: {
			description: string,
			image: string,
			title: string,
			url: string
		},
		title: string
	},
	new: {
		error_saving: string,
		errors: {
			[key: string]: string
		},
		labels: {
			categories: string,
			language: string,
			slug: string,
			tags: string,
			title: string
		},
		placeholders: {
			tags: string,
			title: string
		},
		submit: string
	},
	published: {
		remove: {
			button: string,
			confirm: string,
			success: string,
			title: string
		}
	},
	tabs: {
		categories: string,
		home: string,
		invalid: string,
		media: string,
		new: string,
		published: string
	}
}