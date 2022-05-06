/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useEffect, useState } from 'react';
import { Modal, Button, Spin } from 'antd';
import ajax from '../../api';
import type { IFunctionProps } from '@/interface';
import { getContainer } from '../resourceManager/resModal';
import DetailInfo from '../detailInfo';
import { CATELOGUE_TYPE } from '@/constant';

interface IFnViewModalProps {
	visible: boolean;
	fnId: number | null;
	closeModal: () => void;
}

export default function FnViewModal({ visible, fnId, closeModal }: IFnViewModalProps) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<IFunctionProps | undefined>(undefined);

	const getFnDetail = (id: number) => {
		setLoading(true);
		ajax.getOfflineFn({
			functionId: id,
		})
			.then((res) => {
				if (res.code === 1) {
					setData(res.data);
				}
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const renderContent = () => {
		if (loading) return <Spin />;
		if (!data) return '系统异常';

		return <DetailInfo type={CATELOGUE_TYPE.FUNCTION} data={data} />;
	};

	useEffect(() => {
		if (fnId || fnId === 0) {
			getFnDetail(fnId);
		}
	}, [fnId]);

	const title = data?.type === 2 ? '存储过程详情' : '函数详情';

	return (
		<div id="JS_fnView_modal">
			<Modal
				title={title}
				visible={visible}
				onCancel={closeModal}
				key={fnId}
				width={550}
				footer={[
					<Button size="large" onClick={closeModal} key="cancel">
						关闭
					</Button>,
				]}
				getContainer={() => getContainer('JS_fnView_modal')}
			>
				{renderContent()}
			</Modal>
		</div>
	);
}
