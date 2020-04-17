import React from 'react';
import './style.css';
import { Carton } from '../carton';
import { Link } from '../link';

export function Stage() {
	return (
		<div>
			<div className='topCarton'>
				<Carton />
			</div>
			<div className='eggField'>
				<Link />
			</div>
			<div className='bottomCarton'>
				<Carton />
			</div>
		</div>
	);
};
