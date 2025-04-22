"use client";

import cx from "clsx";
import { useState } from "react";
import styles from "./styles.module.css";
import { Icons } from "../../icons";

var SELECT_KEY = (x) => x.key;

/**
 * @typedef {{
 *  key?: string | number;
 *  [key: string]: any;
 * }} T
 *
 * @param {{
 *  data: Array<T>;
 *  keySelector: (item: T) => string | number;
 *  search: (item: T, term: string) => boolean;
 *  renderItem: (item: T) => JSX.Element;
 *  onSelect: (item: T) => void;
 *  selectedKeys: Array<string | number>;
 *  keepDataVisible: boolean;
 * }} param0
 */
export function DataSearchPicker({
  data,
  keySelector,
  search,
  renderItem,
  onSelect,
  selectedKeys,
  keepDataVisible = false,
}) {
  keySelector = keySelector || SELECT_KEY;

  var { 0: searchTerm, 1: setSearchTerm } = useState("");
  var { 0: searchData, 1: setSearchData } = useState([]);

  var handleSearch = () => {
    var filteredData = data.filter((item) =>
      search(item, searchTerm),
    );
    setSearchData(filteredData);
  };

  var handleResetSearch = () => {
    setSearchTerm("");
    setSearchData(data);
  };

  var visibleData =
    !!searchTerm && searchData.length > 0
      ? searchData
      : keepDataVisible
        ? data
        : [];

  return (
    <div className={styles.root}>
      <div className={styles.searchBlock}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="button" onClick={handleSearch}>
          <Icons.Search width="0.9rem" />
        </button>
        {searchTerm && (
          <button type="button" onClick={handleResetSearch}>
            <Icons.X />
          </button>
        )}
      </div>
      {visibleData.length > 0 && (
        <div className={styles.searchResult}>
          {visibleData.map((item) => (
            <button
              key={keySelector(item)}
              type="button"
              onClick={() => onSelect(item)}
              className={cx(styles.searchItem, {
                [styles.selected]: selectedKeys.includes(
                  keySelector(item),
                ),
              })}
            >
              {renderItem(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
