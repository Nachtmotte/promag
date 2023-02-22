  ARG RUBY_VERSION=3.2.0
  FROM ruby:$RUBY_VERSION

  RUN apt-get update -qq && \
    apt-get install -y build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

  WORKDIR /rails

  ENV RAILS_LOG_TO_STDOUT="1" \
      RAILS_ENV='production' \
      BUNDLE_WITHOUT='development'

  COPY Gemfile* .
  RUN gem install bundler
  RUN bundle install
  COPY . .

  ENTRYPOINT ["/rails/bin/docker-entrypoint"]
  
  EXPOSE 3000
  CMD ["./bin/rails", "server"]