import fs from 'fs';
import path from 'path';

import Parser from '../src/chunk-parser';

const createTestSet = () => [
  {
    text: '{20190121132502,N,\r\n{0,0},2,1,1,1,16,I,"",0,\r\n'
        + '{"U"},"",0,0,0,2,0,\r\n{0}\r\n}',
    expected: {
      date: new Date('2019-01-21T13:25:02.000Z'),
      transactionStatus: 'NotApplicable',
      transaction: null,
      user: { id: 'dd7cc144-d711-4e07-addc-c7d3892d6bda', name: 'user1' },
      computer: 'PC1',
      application: 'Designer',
      connection: 1,
      event: '_$InfoBase$_.EventLogReduce',
      level: 'Information',
      comment: '',
      metadata: null,
      data: '',
      dataPresentation: '',
      server: null,
      port: null,
      syncPort: null,
      session: 2
    }
  },
  {
    text: '{20190121142851,C,\r\n{243331de43730,9d4},2,1,3,2,15,I,"",2,'
        + '\n{"R",26:80f52c44fd838fa111e91d6fb3e36b6e},'
        + '"Документ1 000000007 от 21.01.2019 14:28:51",0,0,0,4,0,\n{0}\n}',
    expected: {
      date: new Date('2019-01-21T14:28:51.000Z'),
      transactionStatus: 'Committed',
      transaction: { id: 2516, date: new Date('2019-01-21T14:28:51.000Z') },
      user: { id: 'dd7cc144-d711-4e07-addc-c7d3892d6bda', name: 'user1' },
      computer: 'PC1',
      application: '1CV8C',
      connection: 2,
      event: '_$Data$_.Post',
      level: 'Information',
      comment: '',
      metadata: {
        id: '7f00cc21-f1c4-46b4-b828-96706aa18533',
        name: 'Документ.Документ1'
      },
      data: '{"R",26:80f52c44fd838fa111e91d6fb3e36b6e}',
      dataPresentation: 'Документ1 000000007 от 21.01.2019 14:28:51',
      server: null,
      port: null,
      syncPort: null,
      session: 4
    }
  }
];

describe('chunk-parser', () => {
  let parser;
  let testSet;

  beforeEach(() => {
    testSet = createTestSet();

    parser = new Parser();
    const dirName = path.resolve(__dirname, './fixture');
    const content = fs.readFileSync(path.join(dirName, 'meta-small.lgf'), {
      encoding: 'utf8'
    });
    parser.parse(content);
  });

  describe('single event', () => {
    it('without transaction', () => {
      const { text, expected } = testSet[0];
      const result = parser.parse(text);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expected);
    });

    it('with transaction', () => {
      const { text, expected } = testSet[1];
      const result = parser.parse(text);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expected);
    });

    it('with meta and group separator', () => {
      const { text, expected } = testSet[0];
      const content = `{2,"PC2",2},\r\n{"DatesMap",\r\n{20190131000000,0}\r\n}${text}`;
      const result = parser.parse(content);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expected);
    });

    it('with meta and title separator', () => {
      const { text, expected } = testSet[0];
      const content = '{2,"PC2",2}\r\n1CV8LOG(ver 2.0)\r\n'
      + `077ca4f7-e5ca-479e-8d9c-40cc331f045e\r\n${text}`;
      const result = parser.parse(content);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expected);
    });
  });

  describe('events', () => {
    it('two events', () => {
      const { text: text1, expected: expected1 } = testSet[0];
      const { text: text2, expected: expected2 } = testSet[1];
      const content = `${text1},\r\n${text2}`;
      const result = parser.parse(content);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expected1);
      expect(result[1]).toEqual(expected2);
    });

    it('two events and group separator', () => {
      const { text: text1, expected: expected1 } = testSet[0];
      const { text: text2, expected: expected2 } = testSet[1];
      const content = `${text1}\r\n{"DatesMap",\r\n{20190131000000,0}\r\n}${text2}`;
      const result = parser.parse(content);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expected1);
      expect(result[1]).toEqual(expected2);
    });

    it('two events and title separator', () => {
      const { text: text1, expected: expected1 } = testSet[0];
      const { text: text2, expected: expected2 } = testSet[1];
      const content = `${text1}\r\n1CV8LOG(ver 2.0)\r\n077ca4f7-e5ca-479e-8d9c-40cc331f045e\r\n\r\n${text2}`;
      const result = parser.parse(content);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expected1);
      expect(result[1]).toEqual(expected2);
    });

    it('many events', () => {
      const dirName = path.resolve(__dirname, './fixture');
      const content = fs.readFileSync(path.join(dirName, 'events-small.lgp'), {
        encoding: 'utf8'
      });
      const result = parser.parse(content);
      expect(result).toHaveLength(35);
    });
  });

  describe('chunks', () => {
    it('one event two chunks', () => {
      const { text, expected } = testSet[0];
      const chunk1 = text.slice(0, text.length - 1);
      const chunk2 = text.slice(text.length - 1);
      expect(parser.parse(chunk1)).toHaveLength(0);

      const result = parser.parse(chunk2);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expected);
    });

    it('one event three chunks', () => {
      const { text, expected } = testSet[0];
      const chunk1 = text.slice(0, text.length - 10);
      const chunk2 = text.slice(text.length - 10, text.length - 5);
      const chunk3 = text.slice(text.length - 5);

      expect(parser.parse(chunk1)).toHaveLength(0);
      expect(parser.parse(chunk2)).toHaveLength(0);

      const result = parser.parse(chunk3);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(expected);
    });
  });
});
