/** @jsx jsx */
import React from "react"
import { jsx } from "theme-ui"
import { Link } from "gatsby"
import { useDocs, useCurrentDoc } from "docz"
import { path } from "ramda"

import * as styles from "gatsby-theme-docz/src/components/NavLink/styles"

const getHeadings = (route, docs) => {
	const doc = docs.find(doc => doc.route === route)
	const headings = path(["headings"], doc)
	return headings ? headings.filter(heading => heading.depth === 2) : []
}

export const NavLink = ({ item, ...props }) => {
	const docs = useDocs()
	const to = item.route
	const headings = docs && getHeadings(to, docs)
	const current = useCurrentDoc() || {};
	const isCurrent = item.route === current.route
	const showHeadings = isCurrent && headings && headings.length > 0
	const links = showHeadings
		? headings.map(heading => (
			<Link
				key={heading.slug}
				to={`${to}#${heading.slug}`}
				sx={styles.smallLink}
				activeClassName="active"
			>
				{heading.value}
			</Link>
		))
		: []

	return [
		<Link
			key={`linky-1`}
			{...props}
			to={to}
			sx={styles.link}
			activeClassName="active"
		/>,
		...links,
	]
}
