import React, { PropTypes } from 'react'
import { autobind } from 'core-decorators'
import InfiniteVirtualizedList from './InfiniteVirtualizedList'

export default class GiftedVirtualizedList extends React.Component {
  static propTypes = {
    onFetch: PropTypes.func.isRequired,
    rowView: PropTypes.func.isRequired,
    paginationWaitingView: PropTypes.func.isRequired,
    emptyView: PropTypes.func.isRequired,
    paginationAllLoadedView: PropTypes.func.isRequired,
    refreshable: PropTypes.bool.isRequired,
    enableEmptySections: PropTypes.bool.isRequired,
    pagination: PropTypes.bool.isRequired,
  }

  state = {
    list: [],
    page: 1,
  }

  componentDidMount() {
    this.loadNextPage()
  }

  @autobind
  loadNextPage() {
    const { onFetch } = this.props
    this.setState({
      isNextPageLoading: true,
    })
    onFetch(this.state.page, (items, { allLoaded }) => {
      this.setState(({ list, page }) => ({
        isNextPageLoading: false,
        hasNextPage: !allLoaded,
        list: list.concat(items),
        page: page + 1,
      }))
    })
  }

  @autobind
  renderItem({ item }) {
    return this.props.rowView(item)
  }

  render() {
    const { list, hasNextPage, isNextPageLoading } = this.state
    const { emptyView, paginationWaitingView, ...otherProps } = this.props

    if (list.length === 0) return emptyView()
    return (
      <InfiniteVirtualizedList
        data={list}
        hasNextPage={hasNextPage}
        isNextPageLoading={isNextPageLoading}
        loadNextPage={this.loadNextPage}
        renderItem={this.renderItem}
        paginationWaitingView={paginationWaitingView}
        getItem={(data, index) => list[index]}
        getItemCount={() => list.length}
        {...otherProps}
      />
    )
  }
}
