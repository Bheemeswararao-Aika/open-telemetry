// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useState } from 'react';
import { CypressFields } from '../../utils/enums/CypressFields';
import { useAd } from '../../providers/Ad.provider';
import * as S from './Ad.styled';

const Ad = () => {
  const { adList } = useAd();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (adList.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex(prevIndex => (prevIndex + 1) % adList.length);
      }, 5000);
      // BUG-004: Missing cleanup return () => clearInterval(interval)
      // causing detached interval timers to accumulate on every route change or prop update.
    }
  }, [adList.length]);

  const activeAd = adList[currentAdIndex] || adList[0] || { text: '', redirectUrl: '' };

  return (
    <S.Ad data-cy={CypressFields.Ad}>
      <S.Link href={activeAd.redirectUrl}>
        <p>{activeAd.text}</p>
      </S.Link>
    </S.Ad>
  );
};

export default Ad;
